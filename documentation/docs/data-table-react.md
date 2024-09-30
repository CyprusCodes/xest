---
id: data-table-react
title: Data Table React
sidebar_label: Data Table React
---

# @xest-ui/data-table

## Description

`xest-ui/data-table` is a powerful UI companion for the xest API framework, designed to create feature-rich, customizable data tables in React application.

## Features

- Sorting
- Filtering
- Data export (PDF, Excel, CSV)
- Column arrangement (drag and drop)
- Column pinning
- Pagination
- Custom router support (Next.js and other React frameworks)
- Csutom components support from your favorite UI library

## Installation

```bash
npm install @xest-ui/data-table
```

## Basic Usage

Here's a simple example of how to use the `xest-ui/data-table` package:

```javascript
import React from "react";
import { Col, DataTable, TableProvider } from "@xest-ui/data-table";
import { User } from "src/types/user";
import { Card } from "@mui/material";
import getUnitsByContactId from "src/services/projects/getUnitsByContactId";
import { useRouter } from "next/router";
import MyPaginator from "src/components/PaginatedTable/MyPaginator";
import { DefaultTableComponents } from "src/components/PaginatedTable/DefaultTableComponents";
import router from "next/router";
import { formatAreaMeasurement } from "src/utils/formatAreaMeasurement";
import updateQueryParams from "src/components/PaginatedTable/updateQueryParams";

interface ContactFlatsTableProps {
  organizationId: string;
  contactId: string;
}

function ContactFlatsTable({
  organizationId,
  contactId,
}: ContactFlatsTableProps) {
  const router = useRouter();

  const cols: Col<User>[] = [
    {
      title: "Project Name",
      dataIndex: "project_name",
      filterType: {
        dbCol: "projects.project_name",
        type: "string",
      },
    },
    {
      title: "Flat No",
      dataIndex: "unit_no",
      filterType: {
        dbCol: "units.unit_no",
        type: "string",
      },
    },
    // ... other columns
    {
      title: "Updated At",
      dataIndex: "updated_at",
      filterType: {
        dbCol: "units.updated_at",
        type: "date",
      },
    },
  ];

  return (
    <Card>
      <TableProvider
        params={{
          apiCallFn: async function (queryParams) {
            let data, error;
            try {
              const res = await getUnitsByContactId(
                organizationId,
                contactId,
                queryParams
              );
              data = res.data;
              console.log(data);
            } catch (err) {
              error = err;
            }
            return { data, error };
          },
          initialPageSize: 25,
          config: {
            updateSearchQueryParams(newParams) {
              updateQueryParams({
                router,
                newParams,
              });
            },
          },
          initialSortCriteria: "-units.updated_at,units.unit_id",
          deps: [contactId],
        }}
        components={DefaultTableComponents}
        columns={cols}
      >
        <DataTable pagination={false} />
        <MyPaginator />
      </TableProvider>
    </Card>
  );
}
```

### This example demonstrates:

Using TableProvider to set up the data source and configuration
Defining columns with custom rendering and filtering options
Integrating with Next.js router for query parameter updates
Using custom components for pagination
Handling API calls and error states

# API Reference

## TableProvider Component

The TableProvider component is the main wrapper for setting up the data table context.

### Params

<ul>
    <li>apiCallFn: Function to fetch data from the API</li>
    <li>initialPageSize: Number of items per page initially</li>
    <li>config: Additional configuration options</li>
    <li>initialSortCriteria: Initial sorting criteria</li>
    <li>deps: Dependencies array for re-fetching data</li>
</ul>

### Components

Below is an example of DefaultCompoents using Mui Components.

```javascript
import { Col, DTComponent, useTable } from "@xest-ui/data-table";
import ClearIcon from "@mui/icons-material/Clear";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  LinearProgress,
  Modal,
  Paper,
  Popover,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import FilterListIcon from "@mui/icons-material/FilterList";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Box, SxProps } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useMemo, useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import moment from "moment";

export const DefaultTableComponents: Partial<DTComponent<any>> = {
  Modal: ({ props, action }) => {
    return (
      <Modal
        open={props.openState}
        onClose={() => props.onClose(false)}
        title={props.title}
        className={props.className}
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: [
              "manageFilter.modal",
              "exportData.modal",
              "arrangeColumnsModal",
            ].includes(action)
              ? "auto"
              : 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
            maxHeight: "max(80vh, 600px)",
            overflow: "auto",
          }}
        >
          <Paper>
            {props.title}
            {props.children}
            {props.footer}
          </Paper>
        </Box>
      </Modal>
    );
  },
  Button: ({ props, action }) => {
    if (action == "columnTitle.filter") {
      return (
        <IconButton {...(props as any)}>
          <FilterListIcon />
        </IconButton>
      );
    }
    if (
      [
        "columnTitle.sort.asc",
        "columnTitle.sort.desc",
        "columnTitle.sort.remove",
      ].includes(action)
    ) {
      return <IconButton {...(props as any)} size="small" />;
    }
    if (action === "pagination.goToLast") {
      return (
        <Button {...(props as any)}>
          <SkipNextIcon />
        </Button>
      );
    }
    if (action === "pagination.goNext") {
      return (
        <Button {...(props as any)}>
          <NavigateNextIcon />
        </Button>
      );
    }
    if (action === "pagination.goToFirst") {
      return (
        <Button {...(props as any)}>
          <SkipPreviousIcon />
        </Button>
      );
    }
    if (action === "pagination.goBack") {
      return (
        <Button {...(props as any)}>
          <ChevronLeftIcon />
        </Button>
      );
    }
    if (action === "filters.FilterBtn") {
      return (
        <Button
          {...(props as any)}
          startIcon={<ClearIcon onClick={(e) => props.onIconClick?.(e)} />}
          variant="contained"
        />
      );
    }
    if (action === "saveFilter") {
      return <Button {...(props as any)} variant="contained" />;
    }
    return <Button {...(props as any)} startIcon={props.icon} />;
  },
  DatePicker: ({ props, action }) => {
    return (
      <DateTimePicker
        label="Basic example"
        value={moment(`${props.value}`).format("YYYY-MM-DD hh:mm:ss")}
        onChange={(value) => {
          if (value) {
            const momentdate = moment(value);
            props.onChange?.({
              // @ts-ignore
              target: {
                value: momentdate.format("YYYY-MM-DD hh:mm:ss"),
              },
            });
          }
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    );
  },
  Dropdown: ({ props, action }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(!!props.open);
    const uniqueId = useMemo(
      () => "dt-dropdown" + Math.random().toString(),
      []
    );

    useEffect(() => {
      if (!props.open) setAnchorEl(null);
      else setAnchorEl(document.getElementById(uniqueId));
    }, [props.open, uniqueId]);

    useEffect(() => {
      setOpen(!!props.open);
    }, [props.open]);

    const handleClose = () => {
      setOpen(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    };

    if (!open) {
      return (
        <div id={uniqueId} onClick={handleClick}>
          {props.children}
        </div>
      );
    }

    return (
      <div>
        <div id={uniqueId}>
          {action?.startsWith("table.title.") ? (
            <FilterListIcon />
          ) : (
            props.children
          )}
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handleClose} //doesnt work, how to close MUI element
        >
          <Box
            sx={{
              p: "10px",
            }}
          >
            {props.options.map((eachOption, index) => (
              <Box
                key={String(eachOption.value) + index}
                onClick={() =>
                  eachOption.onClick?.(eachOption.value, {
                    setOpenState: setOpen,
                  })
                }
              >
                {eachOption.label}
              </Box>
            ))}
          </Box>
        </Popover>
      </div>
    );
  },

  Input: ({ props: { value, ...props }, action }) => {
    if (action === "exportData.modal.checkBox") {
      return (
        <Checkbox
          checked={props.checked}
          onChange={(e) => {
            props.onChange?.(e);
          }}
        />
      );
    }

    if (action === "setFilterValue") {
      return (
        <Input
          value={value}
          type={props.type}
          onChange={(e: any) => {
            props.onChange?.(e);
          }}
          sx={{
            flexGrow: 1,
          }}
        />
      );
    }
    return (
      <Input
        value={value}
        type={props.type}
        onChange={(e: any) => {
          props.onChange?.(e);
        }}
      />
    );
  },

  Radio: ({ props }) => <Radio {...(props as any)} />,
  Table: ({ props }) => {
    const {
      data: { pageData, loading },
    } = useTable();
    if (!pageData?.length && !loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderColor: "divider",
            borderStyle: "solid",
          }}
        >
          <Typography variant="h6">No data</Typography>
        </Box>
      );
    }
    const colStyle: (col: Col<any>) => SxProps<any> = (col) => {
      switch (col.fixed) {
        case "left":
          return {
            position: "sticky",
            left: 0,
            zIndex: 1,
            backgroundColor: (theme) => theme.palette.background.default,
          };
        case "right":
          return {
            position: "sticky",
            right: 0,
            zIndex: 1,
            backgroundColor: (theme) => theme.palette.background.default,
          };
        default:
          return {};
      }
    };
    const tableColumns = (
      <>
        <TableHead>
          <TableRow>
            {props.columns.map((eachColumn, index) => (
              <TableCell
                key={`${
                  String(eachColumn.dataIndex) +
                  index +
                  index +
                  String(eachColumn.dataIndex)
                }`}
                sx={{
                  width: eachColumn.width,
                  ...colStyle(eachColumn),
                  backgroundColor: (theme) => theme.palette.background.default,
                }}
              >
                {eachColumn.title}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {props.loading ? (
              <TableCell colSpan={props.columns.length}>
                <LinearProgress
                  sx={{
                    width: "inherit", // Set the ProgressBar width to fill its container
                    borderRadius: 10, // Optionally set borderRadius
                  }}
                />
              </TableCell>
            ) : undefined}
          </TableRow>
        </TableHead>
      </>
    );
    const tableBody = (
      <TableBody>
        {pageData?.map((eachRow, rowIndex) => {
          const render = (col: Col<any>) => {
            try {
              return (
                col.render?.(eachRow, rowIndex) || eachRow[col.dataIndex as any]
              );
            } catch (err) {
              console.warn(
                `Data Table--- there was an error rendering row\n`,
                eachRow,
                err
              );
              return "error";
            }
          };
          return (
            <TableRow key={JSON.stringify(eachRow)}>
              {props.columns.map((eachCol, colIndex) => (
                <TableCell
                  key={colIndex + String(eachCol.dataIndex)}
                  sx={{
                    ...colStyle(eachCol),
                  }}
                >
                  {render(eachCol)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    );
    return (
      <TableContainer component={Paper}>
        <Table>
          {tableColumns}
          {tableBody}
        </Table>
      </TableContainer>
    );
  },
};
```

The actions prop on each component determines where that component render is coming from. It is strongly typed so suggestions can always pop up from your IDE.

## ReUsable Hooks

### usePaginate Hook

The usePaginate hook is a hook that accepts the following object as prop.

```javascript
interface PaginateProps<T extends Record<string, any> = any> {
  apiCallFn: (
    queryParams: string,
    options: { signal: AbortSignal }
  ) => Promise<T>;
  /** Dependencies that when changed, triggers refresh */
  deps: unknown[];
  initialPageSize?: number;
  initialFilters?: Filter[];
  initialSortCriteria: string | null;
  pageSizes?: number[];
  config?: {
    /** Generator of the key to save filters in the local storage
     * If passed, filters will be saved in local storage as they change
     */
    filtersKeyGen?: () => string;
    /** Pass if more than one table will be rendered on the same webage */
    tableNum?: number | string;
    /**
     * Generator of the key to save pagination in the local storage
     * If passed, data like column arrangments would be saved in local storage
     * @default if not passed, will use dt--config
     */
    localStorageKey?: () => string;

    /**
     * use your own router to update the search params of the browser.
     * If not passed, will use window.location
     * @type {?(params: string) => void}
     * @param {string} params the new search params
     */
    updateSearchQueryParams?: (params: Record<string, string | number>) => void;
    /** whether to show add all records in the pagination component
     * @default false
     *
     */
    pageSizeShowAll?: boolean;
  };
}
```

This is almost identical to the params prop of the `TableProvider`.
It has no dependencies so you can use it with any xest paginated endpoint out of the box.
The `usePaginate` hook returns the following object:

```javascript
{
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    /**  only use _setFilters if you need bespoke behaviour, otherwise see 3 filter methods below */
    _setFilters: setFilters,
    addOrModifyFilter,
    removeFilter,
    resetFilters,
    filters,
    /**column_name */
    setSortCriteria,
    sortCriteria,
    setPageSize,
    pageSize,
    refresh,
    pageData,
    metadata,
    loading,
    error,
    clearFilters,
    filterKeyInLS,
    searchPrams: MemoizedSearchParams,
    pageSizes,
    cursor,
    abortControllerRef,
    queryParams,
    apiCallFn,
    /**
     * Whether its possible to show all pages
     *
     */
    canShowAllPages: !!config.pageSizeShowAll,
    configKeysInLs,
  };
```

### useTable Hook

The `useTable` hook offers similar functionality as the `usePaginate` with the addition of allowing you to configure a parent `TableProvider`.
It does not expect any param, must be called anywhere within React tree under a `TableProvider`, and returns the following object for ones use as well.

```javascript
{
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    /**  only use _setFilters if you need bespoke behaviour, otherwise see 3 filter methods below */
    _setFilters: setFilters,
    addOrModifyFilter,
    removeFilter,
    resetFilters,
    filters,
    /**column_name */
    setSortCriteria,
    sortCriteria,
    setPageSize,
    pageSize,
    refresh,
    pageData,
    metadata,
    loading,
    error,
    clearFilters,
    filterKeyInLS,
    searchPrams: MemoizedSearchParams,
    pageSizes,
    cursor,
    abortControllerRef,
    queryParams,
    apiCallFn,
    /**
     * Whether its possible to show all pages
     *
     */
    canShowAllPages: !!config.pageSizeShowAll,
    configKeysInLs,
  };
```

## DataTable Component

The DataTable Component is the component that has the Tables, filteration and all other features stated above. Once imported and rendered as a descendant of the `TableProvider`, it renders everything by default. Some features can be turned off to use your own custom components when the design does not still fit your needs (as in the `TableProvider` example above, the pagination prop was set to false and a completely custom component utilizing the useTable hook is used).
The DataTable props are:

```javascript
type DataTableProps<T extends Record<string, unknown>> = {
  /** Whether to display top bar or not.
   * pass object to ovverride the default props of the top bar
   * @default Defaults to true
   */
  actions?: boolean | Parameters<typeof ActionsComponent<T>>[0];
  /**props for the pagination component.
   * if false, component will not render
   * * @default Defaults to true
   */
  pagination?: boolean | Parameters<typeof Pagination>[0];
  /** the text to display when there is an error */
  errorTxt?: (error: any) => React.ReactNode;
  /** The key to use. if not provided, will use row index */
  rowKey?: (record: T) => Key;
  loading?: boolean;
} & {
  tableProps?: React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >;
};
```

The actions prop being used is the same the ActionsComponentprops which could be imported from the package

##### ActionsComponentProps

```javascript
interface ActionsComponentProps<T extends Record<any, any>> {
  /** props for the export Data button */
  exportData?: ExportDataProps<T> | false;
  /** props for page size */
  pageSize?:
    | {
        /** The page sizes to use for setting the page Size dropdown */
        sizes: number[];
      }
    | false;
  refresh?:
    | {
        toolTip?: {
          title?: React.ReactNode;
        };
        btn?: DTButtonProps;
      }
    | false;
  arrangeColumns?: ArrangeColumnsProps | false;
  savedFilter?: FilterSaverProps | false;
}
```

For these props, once false is passed, it means it should not be shown.

#### Export data

To create your own custom table with same usability, you can utilize the useTable hook with the TableProvider.
