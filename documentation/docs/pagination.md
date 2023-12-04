---
id: Pagination
title: Pagination
sidebar_label: Pagination
---

### Function

The `paginate` function facilitates paginated data retrieval from a database based on specified criteria.

| Parameter              | Description                                                | Type                          | Example                                                                                             |
| ---------------------- | ---------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `basePath`             | The base path used for pagination links.                   | String                        | req.path                                                                                            |
| `baseTable`            | The primary table from which data is retrieved.            | String                        | `'personal_information'`                                                                            |
| `selectFields`         | Fields selected from the involved tables.                  | Array of Strings              | `['personal_information.first_name', 'personal_information.last_name']`                             |
| `joinStatements`       | SQL join statements connecting related tables.             | Array of SQL Template Strings | sql `LEFT JOIN organization ON personal_information.organization_id = organization.organization_id` |
| `sortableAttributes`   | Attributes allowing data sorting.                          | Array of Strings              | `['personal_information.personal_information_id', 'personal_information.created_at']`               |
| `filterableAttributes` | Attributes that can be filtered with supported operations. | Array of Objects              | [See below](#filterable-attributes)                                                                 |
| `mandatoryFilter`      | A condition that must be met for all retrieved records.    | SQL Template String           | sql `AND personal_information.organization_id=1`                                                    |
| `sortBy`               | Field by which data is sorted.                             | String                        | req.query.sort_by                                                                                   |
| `limit`                | Number of records per page.                                | Number                        | req.query.page_size                                                                                 |
| `page`                 | Current page number.                                       | String                        | req.query.page                                                                                      |
| `direction`            | Direction of pagination (next or previous).                | String                        | req.query.direction                                                                                 |
| `filters`              | Filters applied to the data.                               | String                        | req.query.filters                                                                                   |
| `cursorValues`         | Cursor values used for pagination.                         | String                        | req.query.cursor                                                                                    |

### Example Usage:

#### Table 1 - ORGANIZATION

| Field Name           | Data Type   | Constraints                 |
| -------------------- | ----------- | --------------------------- |
| organization_id (PK) | int         | AUTO_INCREMENT, PRIMARY KEY |
| organization_name    | VARCHAR(50) | NOT NULL, UNIQUE            |
| created_at           | DATETIME    | DEFAULT CURRENT_TIMESTAMP   |

#### Table 2 - PERSONAL INFORMATION

| Field Name              | Data Type   | Constraints                 |
| ----------------------- | ----------- | --------------------------- |
| personal_information_id | int         | AUTO_INCREMENT, PRIMARY KEY |
| first_name              | VARCHAR(50) | NOT NULL                    |
| last_name               | VARCHAR(50) | NOT NULL                    |
| email                   | VARCHAR(50) | NOT NULL, UNIQUE            |
| education_level         | VARCHAR(50) | NOT NULL                    |
| organization_id (FK)    | int         | NOT NULL                    |
| created_at              | DATETIME    | DEFAULT CURRENT_TIMESTAMP   |

**Foreign Key:** `organization_id` references `organization(organization_id)`

```javascript
const getPersonalInformation = async (req, res) => {
  const resultset = await paginate({
    basePath: req.path,
    baseTable: "personal_information",
    selectFields: [
      "personal_information.personal_information_id",
      "personal_information.first_name",
      "personal_information.last_name",
      "personal_information.email",
      "personal_information.education_level",
      "personal_information.organization_id",
      "personal_information.created_at",
    ],
    joinStatements: [
      sql`LEFT JOIN organization ON personal_information.organization_id = organization.organization_id`,
      // Add other necessary join statements
    ],
    sortableAttributes: [
      "personal_information.personal_information_id",
      "personal_information.created_at",
    ],
    filterableAttributes: [
      {
        column: "personal_information.first_name",
        operations: [FILTERS.containsIgnoreCase],
      },
      {
        column: "personal_information.personal_information_id",
        operations: [
          FILTERS.equals,
          FILTERS.notEquals,
          FILTERS.greaterThan,
          FILTERS.greaterThanOrEqual,
          FILTERS.lessThan,
          FILTERS.lessThanOrEqual,
          FILTERS.in,
          FILTERS.notIn,
          FILTERS.between,
        ],
      },
      // Include other filterable attributes
    ],
    groupBy: ["personal_information.personal_information_id"],
    mandatoryFilter: sql`AND personal_information.organization_id=${req.params.orgId}`,
    sortBy: req.query.sort_by,
    limit: req.query.page_size,
    page: req.query.page, // "first" | "last" | null
    direction: req.query.direction, // next | previous
    filters: req.query.filters,
    cursorValues: req.query.cursor,
  });
  return res.send(resultset);
};

module.exports = getPersonalInformation;
```

### Filterable Attributes

The `filterableAttributes` section in the code allows for defining both pre-defined and custom filters for the `personal_information` table.

#### Pre-defined Filters

- `personal_information.first_name`:

  - Operation: `FILTERS.containsIgnoreCase`
  - Description: Filters based on a case-insensitive partial match of the first name.

- `personal_information.personal_information_id`:

  - Operations:
    - `FILTERS.equals`
    - `FILTERS.notEquals`
    - `FILTERS.greaterThan`
    - `FILTERS.greaterThanOrEqual`
    - `FILTERS.lessThan`
    - `FILTERS.lessThanOrEqual`
    - `FILTERS.in`
    - `FILTERS.notIn`
    - `FILTERS.between`
  - Description: Offers various operations for filtering based on the `personal_information_id`.

#### Custom Filters

- `personal_information.personal_information_id`:
  - Operations:
    - `FILTERS.containsIgnoreCase`
    - Custom Operator: `searchPersonByFullName`
    - Description: Searches personal information based on a full name match.
    - Custom Filter Function:
      ```javascript
      {
        column: "personal_information.personal_information_id",
        operations: [
          FILTERS.containsIgnoreCase,
          {
            operator: "searchPersonByFullName",
            description: "search personal information by using full name",
            minimumNumberOfOperands: 1,
            maximumNumberOfOperands: 1,
            filterFn: operands => {
              const filterString = operands[0];
              if (filterString) {
                return sql`(LOWER(personal_information.first_name) LIKE ${`%${filterString}%`} OR LOWER(personal_information.last_name) LIKE ${`%${filterString}%`}) `;
              }
              return sql``;
            }
          }
        ]
      },
      ```
      This function checks for a partial match of the provided full name in `first_name` or `last_name`.

### Example Implementation - Client Side:

### `usePaginate` Custom Hook

#### Purpose

The `usePaginate` hook manages paginated data retrieval and manipulation through API calls in React.

#### State Variables

- `loading`: Indicates if data is being fetched (`true`) or not (`false`).
- `error`: Stores any API call errors.
- `pageData`: Holds the fetched data for the current page.
- `metadata`: Additional pagination-related metadata.
- `pageSize`: Number of items per page.
- `filters`: Array of applied filters to the data.
- `cursor`: Stores the pagination cursor.
- `direction` and `page`: Indicate pagination direction and current page type.
- `sortCriteria`: Criteria used for data sorting.

#### Functions

- `goToFirstPage`, `goToLastPage`, `goToPreviousPage`, `goToNextPage`: Navigate between pages.
- `resetFilters`, `addOrModifyFilter`, `removeFilter`: Filter manipulation functions.
- `_setFilters`: Custom method to set filters directly.
- `refresh`: Function to refresh data based on dependency changes.

#### Dependencies

- Takes an API call function, dependencies, initial page size, filters, and sorting criteria.

#### Usage

This hook facilitates managing paginated data fetching, manipulation, and navigation within a React component.

```javascript

hooks/use-paginate.ts
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { AxiosPromise } from "axios";

enum DIRECTION {
  NEXT = "next",
  PREVIOUS = "previous",
}

enum PAGE_TYPE {
  FIRST = "first",
  LAST = "last",
}

const usePaginate = (
  apiCallFn: (queryParams: any) => AxiosPromise<any>,
  deps: any = [],
  initialPageSize = 20,
  initialFilters: any = null,
  initialSortCriteria: any = null
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [pageData, setPageData] = useState<any>({});
  const [metadata, setMetaData] = useState<any>({});
  const [pageSize, setPageSize] = useState<any>(initialPageSize);
  const [filters, setFilters] = useState<any>(initialFilters);
  const [cursor, setCursor] = useState<string | null>(null);
  const [direction, setDirection] = useState<DIRECTION | null>(null);
  const [page, setPage] = useState<PAGE_TYPE | null>(null);
  const [sortCriteria, setSortCriteria] = useState<any>(initialSortCriteria);

  const enrichedDependencies = useMemo(() => {
    return [...deps, pageSize, sortCriteria, direction, page, cursor, filters];
  }, [deps, pageSize, sortCriteria, direction, page, cursor, filters]);

  const queryParams = useRef({
    page_size: pageSize,
    sort_by: sortCriteria,
    ...(direction ? { direction } : {}),
    ...(page ? { page } : {}),
    ...(cursor ? { cursor } : {}),
    ...(filters ? { filters } : {}),
  });

  const refresh = useCallback(async () => {
    try {
      const response = await apiCallFn(queryParams.current);
      if (response.data.errors) {
        setError(response.data.errors);
        return;
      }
      setPageData(response.data.data);
      setMetaData(response.data.metadata);
      setLoading(false);
    } catch (error) {
      setError("API Call Failed");
    }
  }, [enrichedDependencies]);

  useEffect(() => {
    queryParams.current = {
      page_size: pageSize,
      sort_by: sortCriteria,
      ...(direction ? { direction } : {}),
      ...(page ? { page } : {}),
      ...(cursor ? { cursor } : {}),
      ...(filters ? { filters } : {}),
    };
    refresh();
  }, enrichedDependencies);

  const goToFirstPage = () => {
    setPage(PAGE_TYPE.FIRST);
    setCursor(null);
    setDirection(null);
  };

  const goToLastPage = () => {
    setPage(PAGE_TYPE.LAST);
    setCursor(null);
    setDirection(null);
  };

  const goToPreviousPage = () => {
    setPage(null);
    setDirection(DIRECTION.PREVIOUS);
    if (metadata && metadata.startCursor) {
      setCursor(metadata.startCursor);
    }
  };

  const goToNextPage = () => {
    setPage(null);
    setDirection(DIRECTION.NEXT);
    if (metadata && metadata.endCursor) {
      setCursor(metadata.endCursor);
    }
  };

  const resetFilters = () => {
    setPage(null);
    setFilters(initialFilters);
    setDirection(null);
    setCursor(null);
  };

  const addOrModifyFilter = (newFilter: any) => {
    setFilters((previousFilters: any) => {
      const existingFilterIndex = previousFilters.findIndex(
        (filter: any) =>
          newFilter.column === filter.column &&
          newFilter.operation === filter.operation
      );

      if (existingFilterIndex !== -1) {
        // Replace the existing record with the new one
        const updatedFilters = [...previousFilters];
        updatedFilters[existingFilterIndex] = newFilter;
        return updatedFilters;
      }

      return [...previousFilters, newFilter];
    });
    setPage(null);
    setDirection(null);
    setCursor(null);
  };

  const removeFilter = (filterToRemove: any) => {
    setFilters((previousFilters: any) => {
      // Use the filter method to create a new array without the filter to remove
      const updatedFilters = previousFilters.filter((filter: any) => {
        return (
          filter.column !== filterToRemove.column ||
          filter.operation !== filterToRemove.operation
        );
      });

      return updatedFilters;
    });
    setPage(null);
    setDirection(null);
    setCursor(null);
  };

  return {
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    // only use _setFilters if you need bespoke behaviour, otherwise see 3 filter methods below
    _setFilters: setFilters,
    addOrModifyFilter,
    removeFilter,
    resetFilters,
    filters,
    setSortCriteria,
    sortCriteria,
    setPageSize,
    pageSize,
    refresh,
    pageData,
    metadata,
    loading,
    error,
  };
};

export default usePaginate;
```

#### Using the `usePaginate` Hook

To manage pagination on the frontend, you can utilize the `usePaginate` hook, which facilitates various pagination functionalities and data retrieval.

```javascript
const {
  goToNextPage,
  goToPreviousPage,
  goToFirstPage,
  goToLastPage,
  setPageSize,
  pageSize,
  refresh,
  pageData,
  metadata,
  loading,
  error,
} = usePaginate(
  // Fetch data function
  (queryParams) => {
    return getPersonalInformations({ orgId: organizationId }, queryParams);
  },
  // Dependencies triggering data fetching
  [organizationId],
  // Row per page limit
  rowPerPageLimit,
  // Initial filters to apply
  initialFilters,
  // Default sorting criteria
  "personal_information.personal_information_id, personal_information.created_at"
);
```
