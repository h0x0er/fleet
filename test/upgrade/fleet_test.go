package upgrade

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"testing"
	"time"

	"github.com/cenkalti/backoff"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

// Slots correspond to docker-compose fleet services, either fleet-a or fleet-b
const (
	slotA = "a"
	slotB = "b"
)

// Fleet represents the fleet server and its dependencies used for testing purposes
type Fleet struct {
	t           *testing.T
	ProjectName string
	FilePath    string
	Version     string

	HTTPClient   *http.Client
	dockerClient client.ContainerAPIClient
}

func NewFleet(t *testing.T, version string) *Fleet {
	// don't use test name because it will be normalized
	projectName := "fleet-test-" + strconv.FormatUint(rand.Uint64(), 16)

	// create client that accepts fleet's self-signed certificate
	rootPEM, err := ioutil.ReadFile("fleet.crt")
	if err != nil {
		t.Fatal(err)
	}

	roots := x509.NewCertPool()
	ok := roots.AppendCertsFromPEM(rootPEM)
	if !ok {
		t.Fatalf("parse root certificate: %v", err)
	}

	tlsConfig := &tls.Config{RootCAs: roots}
	transport := &http.Transport{TLSClientConfig: tlsConfig}
	httpClient := &http.Client{Transport: transport}

	dockerClient, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		t.Fatalf("create docker client: %v", err)
	}

	f := &Fleet{
		t:            t,
		ProjectName:  projectName,
		FilePath:     "docker-compose.yaml",
		Version:      version,
		HTTPClient:   httpClient,
		dockerClient: dockerClient,
	}

	// t.Cleanup(f.cleanup)

	if _, err := f.Start(); err != nil {
		t.Fatalf("start fleet: %v", err)
	}

	return f
}

func (f *Fleet) Start() ([]byte, error) {
	env := map[string]string{
		"FLEET_VERSION_A": f.Version,
	}
	_, err := f.execCompose(env, "pull", "--parallel")
	if err != nil {
		fmt.Fprintf(os.Stderr, "fail to pull: %v\n", err)
		fmt.Fprintf(os.Stderr, "retrying pull...\n")

		_, err := f.execCompose(env, "pull", "--parallel")
		if err != nil {
			return nil, err
		}
	}

	// start mysql and wait until ready
	_, err = f.execCompose(env, "up", "-d", "mysql")
	if err != nil {
		return nil, err
	}
	if err := f.waitMYSQL(); err != nil {
		return nil, err
	}

	// run the migrations using the fleet-a service
	_, err = f.execCompose(env, "run", "-T", "fleet-a", "fleet", "prepare", "db", "--no-prompt")
	if err != nil {
		return nil, err
	}

	// start fleet-a and reverse proxy
	_, err = f.execCompose(env, "up", "-d", "fleet-a", "fleet")
	if err != nil {
		return nil, err
	}

	if err := f.waitFleet(); err != nil {
		return nil, err
	}

	return nil, nil
}

func (f *Fleet) waitMYSQL() error {

	// get the random mysql host port assigned by docker
	argsName := filters.Arg("name", fmt.Sprintf("%s_mysql_1", f.ProjectName))
	containers, err := f.dockerClient.ContainerList(context.TODO(), types.ContainerListOptions{Filters: filters.NewArgs(argsName), All: true})
	if err != nil {
		return err
	}
	if len(containers) == 0 {
		return fmt.Errorf("no mysql container found")
	}
	port := containers[0].Ports[0].PublicPort

	dsn := fmt.Sprintf("fleet:fleet@tcp(localhost:%d)/fleet", port)

	retryInterval := 5 * time.Second
	timeout := 1 * time.Minute

	ticker := time.NewTicker(retryInterval)
	defer ticker.Stop()

	timeoutChan := time.After(timeout)
	for {
		select {
		case <-timeoutChan:
			return fmt.Errorf("db connection failed after %s", timeout)
		case <-ticker.C:
			db, err := sqlx.Connect("mysql", dsn)
			if err != nil {
				f.t.Logf("failed to connect to db: %v", err)
			} else {
				db.Close()
				return nil
			}
		}
	}
}

func (f *Fleet) waitFleet() error {

	// get the random fleet host port assigned by docker
	argsName := filters.Arg("name", fmt.Sprintf("%s_fleet_1", f.ProjectName))
	containers, err := f.dockerClient.ContainerList(context.TODO(), types.ContainerListOptions{Filters: filters.NewArgs(argsName), All: true})
	if err != nil {
		return err
	}
	if len(containers) == 0 {
		return fmt.Errorf("no fleet container found")
	}
	port := containers[0].Ports[0].PublicPort
	healthURL := fmt.Sprintf("https://localhost:%d/healthz", port)

	retryStrategy := backoff.NewExponentialBackOff()
	retryStrategy.MaxInterval = 1 * time.Second

	if err := backoff.Retry(
		func() error {
			resp, err := f.HTTPClient.Get(healthURL)
			if err != nil {
				return err
			}
			if resp.StatusCode != http.StatusOK {
				return fmt.Errorf("non-200 status code: %d", resp.StatusCode)
			}
			return nil
		},
		retryStrategy,
	); err != nil {
		return fmt.Errorf("checking server health: %w", err)
	}

	return nil
}

func (f *Fleet) cleanup() {
	args := []string{
		"--project-name", f.ProjectName,
		"--file", f.FilePath,
	}

	downCmd := exec.Command("docker-compose", append(args, "down", "-v")...)
	output, err := downCmd.CombinedOutput()
	if err != nil {
		fmt.Fprintf(os.Stderr, "stop fleet: %v %s", err, string(output))
	}
}

func (f *Fleet) execCompose(env map[string]string, args ...string) ([]byte, error) {

	// docker compose variables via environment eg FLEET_VERSION_A
	e := os.Environ()
	for k, v := range env {
		e = append(e, fmt.Sprintf("%s=%s", k, v))
	}

	// prepend base args
	args = append([]string{
		"--project-name", f.ProjectName,
		"--file", f.FilePath,
	}, args...)

	cmd := exec.Command("docker-compose", args...)
	cmd.Env = e
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("docker-compose: %v %s", err, string(output))
	}

	return output, nil
}

// Upgrade upgrades fleet to a specified version. Runs migrations, starts the new version of fleet, and swaps
// the ngnix reverse proxy when healthy.
func (f *Fleet) Upgrade(toVersion string) error {

	env := map[string]string{
		"FLEET_VERSION_B": toVersion,
	}

	// run migrations using fleet-b
	serviceName := "fleet-b"
	_, err := f.execCompose(env, "run", "-T", serviceName, "fleet", "prepare", "db", "--no-prompt")
	if err != nil {
		return fmt.Errorf("run migrations: %v", err)
	}

	// start the service
	_, err = f.execCompose(env, "up", "-d", serviceName)
	if err != nil {
		return fmt.Errorf("start fleet on inactive slot: %v", err)
	}



	return nil
}
