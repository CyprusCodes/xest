---
id: Pagination
title: Pagination
sidebar_label: Pagination
---

## Function

The `paginate` function facilitates paginated data retrieval from a database based on specified criteria.

| Parameter              | Description                                                | Type                          | Example                                                                                             |
| ---------------------- | ---------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `basePath`             | The base path used for pagination links.                   | String                        | `'/personalInformation'`                                                                            |
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
