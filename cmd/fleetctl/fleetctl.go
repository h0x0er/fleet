package main

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"math/rand"
	"os"
	"path"
	"runtime"
	"time"

	eefleetctl "github.com/fleetdm/fleet/v4/ee/fleetctl"
	"github.com/kolide/kit/version"
	"github.com/urfave/cli/v2"
)

const (
	defaultFileMode = 0o600
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	app := createApp(os.Stdin, os.Stdout, exitErrHandler)
	app.Run(os.Args)
}

// exitErrHandler implements cli.ExitErrHandlerFunc. If there is an error, prints it to stderr and exits with status 1.
func exitErrHandler(c *cli.Context, err error) {
	if err == nil {
		return
	}

	fmt.Fprintf(c.App.ErrWriter, "Error: %+v\n", err)

	if errors.Is(err, fs.ErrPermission) {
		switch runtime.GOOS {
		case "darwin", "linux":
			fmt.Fprintf(c.App.ErrWriter, "\nThis error can usually be resolved by fixing the permissions on the %s directory, or re-running this command with sudo.\n", path.Dir(c.String("config")))
		case "windows":
			fmt.Fprintf(c.App.ErrWriter, "\nThis error can usually be resolved by fixing the permissions on the %s directory, or re-running this command with 'Run as administrator'.\n", path.Dir(c.String("config")))
		}
	}
	cli.OsExiter(1)
}

func createApp(reader io.Reader, writer io.Writer, exitErrHandler cli.ExitErrHandlerFunc) *cli.App {
	app := cli.NewApp()
	app.Name = "fleetctl"
	app.Usage = "CLI for operating Fleet"
	app.Version = version.Version().Version
	app.ExitErrHandler = exitErrHandler
	cli.VersionPrinter = func(c *cli.Context) {
		version.PrintFull()
	}
	app.Reader = reader
	app.Writer = writer
	app.ErrWriter = writer

	app.Commands = []*cli.Command{
		applyCommand(),
		deleteCommand(),
		setupCommand(),
		loginCommand(),
		logoutCommand(),
		queryCommand(),
		getCommand(),
		{
			Name:  "config",
			Usage: "Modify Fleet server connection settings",
			Subcommands: []*cli.Command{
				configSetCommand(),
				configGetCommand(),
			},
		},
		convertCommand(),
		goqueryCommand(),
		userCommand(),
		debugCommand(),
		previewCommand(),
		eefleetctl.UpdatesCommand(),
		hostsCommand(),
		vulnerabilityDataStreamCommand(),
		packageCommand(),
	}
	return app
}
