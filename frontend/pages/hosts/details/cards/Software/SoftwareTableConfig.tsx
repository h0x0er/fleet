import React from "react";
import { Link } from "react-router";
import ReactTooltip from "react-tooltip";

import { formatDistanceToNow } from "date-fns";

import { ISoftware } from "interfaces/software";
import { IVulnerability } from "interfaces/vulnerability";

import PATHS from "router/paths";
import HeaderCell from "components/TableContainer/DataTable/HeaderCell/HeaderCell";
import TextCell from "components/TableContainer/DataTable/TextCell";
import TooltipWrapper from "components/TooltipWrapper";
import Chevron from "../../../../../../assets/images/icon-chevron-right-9x6@2x.png";

interface IHeaderProps {
  column: {
    title: string;
    isSortedDesc: boolean;
  };
}
interface ICellProps {
  cell: {
    value: number | string | string[];
  };
  row: {
    original: ISoftware;
    index: number;
  };
}

interface IStringCellProps extends ICellProps {
  cell: {
    value: string;
  };
}

interface IVulnCellProps extends ICellProps {
  cell: {
    value: string[];
  };
}

interface ILastUsedCellProps extends ICellProps {
  cell: {
    value: string;
  };
}

interface IDataColumn {
  title: string;
  Header: ((props: IHeaderProps) => JSX.Element) | string;
  accessor: string;
  Cell:
    | ((props: IStringCellProps) => JSX.Element)
    | ((props: IVulnCellProps) => JSX.Element);
  disableHidden?: boolean;
  disableSortBy?: boolean;
  disableGlobalFilter?: boolean;
  sortType?: string;
  // Filter can be used by react-table to render a filter input inside the column header
  Filter?: () => null | JSX.Element;
  filter?: string; // one of the enumerated `filterTypes` for react-table
  // (see https://github.com/tannerlinsley/react-table/blob/master/src/filterTypes.js)
  // or one of the custom `filterTypes` defined for the `useTable` instance (see `DataTable`)
}

const TYPE_CONVERSION: Record<string, string> = {
  apt_sources: "Package (APT)",
  deb_packages: "Package (deb)",
  portage_packages: "Package (Portage)",
  rpm_packages: "Package (RPM)",
  yum_sources: "Package (YUM)",
  npm_packages: "Package (NPM)",
  atom_packages: "Package (Atom)",
  python_packages: "Package (Python)",
  apps: "Application (macOS)",
  chrome_extensions: "Browser plugin (Chrome)",
  firefox_addons: "Browser plugin (Firefox)",
  safari_extensions: "Browser plugin (Safari)",
  homebrew_packages: "Package (Homebrew)",
  programs: "Program (Windows)",
  ie_extensions: "Browser plugin (IE)",
  chocolatey_packages: "Package (Chocolatey)",
  pkg_packages: "Package (pkg)",
};

const formatSoftwareType = (source: string) => {
  const DICT = TYPE_CONVERSION;
  return DICT[source] || "Unknown";
};

const condenseVulnerabilities = (vulns: IVulnerability[]): string[] => {
  const condensed =
    (vulns?.length &&
      vulns
        .slice(-3)
        .map((v) => v.cve)
        .reverse()) ||
    [];
  return vulns?.length > 3
    ? condensed.concat(`+${vulns?.length - 3} more`)
    : condensed;
};

interface ISoftwareTableData extends Omit<ISoftware, "vulnerabilities"> {
  vulnerabilities: string[];
}

export const generateSoftwareTableData = (
  software: ISoftware[]
): ISoftwareTableData[] => {
  return software.map((s) => {
    return {
      ...s,
      vulnerabilities: condenseVulnerabilities(s.vulnerabilities || []),
    };
  });
};

// NOTE: cellProps come from react-table
// more info here https://react-table.tanstack.com/docs/api/useTable#cell-properties
export const generateSoftwareTableHeaders = (
  deviceUser = false
): IDataColumn[] => {
  const tableHeaders: IDataColumn[] = [
    {
      title: "Name",
      Header: (cellProps) => (
        <HeaderCell
          value={cellProps.column.title}
          isSortedDesc={cellProps.column.isSortedDesc}
        />
      ),
      accessor: "name",
      disableSortBy: false,
      disableGlobalFilter: false,
      Cell: (cellProps: IStringCellProps) => {
        const { name, bundle_identifier } = cellProps.row.original;
        if (bundle_identifier) {
          return (
            <span className="name-container">
              <TooltipWrapper
                tipContent={`
                <span>
                  <b>Bundle identifier: </b>
                  <br />
                  ${bundle_identifier}
                </span>
              `}
              >
                {name}
              </TooltipWrapper>
            </span>
          );
        }
        return <TextCell value={name} />;
      },
      sortType: "caseInsensitive",
    },
    {
      title: "Version",
      Header: "Version",
      disableSortBy: true,
      disableGlobalFilter: true,
      accessor: "version",
      Cell: (cellProps: IStringCellProps) => {
        return <TextCell value={cellProps.cell.value} />;
      },
    },
    {
      title: "Type",
      Header: (cellProps) => (
        <HeaderCell
          value={cellProps.column.title}
          isSortedDesc={cellProps.column.isSortedDesc}
        />
      ),
      disableSortBy: false,
      disableGlobalFilter: true,
      accessor: "source",
      Cell: (cellProps: IStringCellProps) => (
        <TextCell value={cellProps.cell.value} formatter={formatSoftwareType} />
      ),
    },
    {
      title: "Vulnerabilities",
      Header: "Vulnerabilities",
      accessor: "vulnerabilities",
      disableSortBy: true,
      disableGlobalFilter: false,
      Filter: () => null, // input for this column filter outside of column header
      filter: "hasLength", // filters out rows where vulnerabilities has no length if filter value is `true`
      Cell: (cellProps: IVulnCellProps): JSX.Element => {
        const vulnerabilities = cellProps.cell.value || [];
        const tooltipText = vulnerabilities?.map((value) => {
          return (
            <span key={`vuln_${value}`}>
              {value}
              <br />
            </span>
          );
        });

        if (!vulnerabilities?.length) {
          return <span className="vulnerabilities text-muted">---</span>;
        }
        return (
          <>
            <span
              className={`vulnerabilities ${
                vulnerabilities.length > 1 ? "text-muted" : ""
              }`}
              data-tip
              data-for={`vulnerabilities__${cellProps.row.original.id}`}
              data-tip-disable={vulnerabilities.length <= 1}
            >
              {vulnerabilities.length === 1
                ? vulnerabilities[0]
                : `${vulnerabilities.length} vulnerabilities`}
            </span>
            <ReactTooltip
              place="top"
              type="dark"
              effect="solid"
              backgroundColor="#3e4771"
              id={`vulnerabilities__${cellProps.row.original.id}`}
              data-html
            >
              <span className={`vulnerabilities tooltip__tooltip-text`}>
                {tooltipText}
              </span>
            </ReactTooltip>
          </>
        );
      },
    },
    {
      title: "Last used",
      Header: (cellProps) => (
        <HeaderCell
          value={cellProps.column.title}
          isSortedDesc={cellProps.column.isSortedDesc}
        />
      ),
      accessor: "last_opened_at",
      Cell: (cellProps: ILastUsedCellProps): JSX.Element => {
        const lastUsed = cellProps.cell.value
          ? `${formatDistanceToNow(Date.parse(cellProps.cell.value))} ago`
          : "Unavailable";
        const hasLastUsed = lastUsed !== "Unavailable";
        return (
          <>
            <span
              className={`last-used ${
                lastUsed === "Unavailable" ? "text-muted" : ""
              }`}
              data-tip
              data-for={`last_used__${cellProps.row.original.id}`}
              data-tip-disable={hasLastUsed}
            >
              {lastUsed}
            </span>
            <ReactTooltip
              place="top"
              type="dark"
              effect="solid"
              backgroundColor="#3e4771"
              id={`last_used__${cellProps.row.original.id}`}
              className="last_used_tooltip"
              data-tip-disable={hasLastUsed}
              data-html
            >
              <span className={`last_used tooltip__tooltip-text`}>
                Last used information <br />
                is only available for the <br />
                Application (macOS) <br />
                software type.
              </span>
            </ReactTooltip>
          </>
        );
      },
      sortType: "dateStrings",
    },
    {
      title: "",
      Header: "",
      disableSortBy: true,
      disableGlobalFilter: true,
      accessor: "linkToFilteredHosts",
      Cell: (cellProps: IStringCellProps) => {
        return (
          <Link
            to={`${PATHS.MANAGE_HOSTS}?software_id=${cellProps.row.original.id}`}
            className={`software-link`}
          >
            View all hosts{" "}
            <img alt="link to hosts filtered by software ID" src={Chevron} />
          </Link>
        );
      },
      disableHidden: true,
    },
  ];

  // Device user cannot view all hosts software
  if (deviceUser) {
    tableHeaders.pop();
  }

  return tableHeaders;
};

export default { generateSoftwareTableHeaders, generateSoftwareTableData };
