---
id: query-interface
title: Query Interface
sidebar_label: Query Interface
---

## submitQuery

_submitQuery_ gives you the property of using the sql language inside backticks.

### sql

This helper is used when you want to stitch together bits of SQL, below is an example where `invoiceId` or `clientId` variables are used to construct a **WHERE** clause dynamically. User can provide either of these two parameters when calling `selectMiscCharges` query.

```
const { submitQuery, sql } = require("~root/database");

const selectMiscCharges = ({
  invoiceId,
  clientId
}) => submitQuery`
 SELECT
    misc_charges.invoice_id,
    misc_charges.client_id
  FROM
    misc_charges
  WHERE
    1 = 1
    ${invoiceId ? sql`AND misc_charges.invoice_id = ${invoiceId}` : sql``}
    ${clientId ? sql`AND misc_charges.client_id = ${clientId}` : sql``}
`;

module.exports = selectMiscCharges;
```

### sqlId

This helper is used when you want to set _table names_, or _column names_ in your query dynamically. It gives you protection against SQL injection attacks. It uses `mysql.escapeId` utility behind the scenes. You can refer to docs [here](https://github.com/mysqljs/mysql#escaping-query-identifiers).

```
const { submitQuery, sqlId } = require("~root/database");
const TagGroupAssociatedWith = require("~root/constants/TagGroupAssociatedWith");

const COLUMN = {
  [TagGroupAssociatedWith.order]: "order_id",
  [TagGroupAssociatedWith.sku]: "sku_id",
  [TagGroupAssociatedWith.product]: "product_id",
  [TagGroupAssociatedWith.delivery]: "delivery_id"
};

const removeAnnotations = ({
  annotationGroupId,
  entityId,
  associatedWith
}) => submitQuery`
    DELETE FROM annotations
    WHERE annotation_group_id = ${annotationGroupId}
    AND ${sqlId(COLUMN[associatedWith])} = ${entityId}
`;

module.exports = removeAnnotations;
```

### sqlValueOrNull

This helper is used when writing UPDATE or INSERT queries where target column is a NULLABLE field. It converts any **undefined** variables to NULL values.

```
const { submitQuery, sqlValueOrNull } = require("~root/database");

const updateOrderImportLogs = ({
  orderImportLogId,
  importCompletedAt,
  apiErrors,
  orderImportErrors,
  importedOrders,
  failedOrders,
  skippedOrders
}) => submitQuery`
  UPDATE 
    order_import_logs
  SET
    import_completed_at = ${sqlValueOrNull(importCompletedAt)},
    api_errors = ${sqlValueOrNull(apiErrors)},
    import_errors = ${sqlValueOrNull(orderImportErrors)},
    imported_orders = ${sqlValueOrNull(importedOrders)},
    failed_orders = ${sqlValueOrNull(failedOrders)},
    skipped_orders = ${sqlValueOrNull(skippedOrders)}
  WHERE
    order_import_log_id = ${orderImportLogId}
`;

module.exports = updateOrderImportLogs;
```

### Transactions

Xest allows you to work with SQL transactions by utilising 3 helper functions in your actions. If any of the queries within the transaction block fails, all queries within the transaction will be reverted.

You'll have to wrap all the queries you want to be part of the transaction between `startTransaction` and `commitTransaction` calls in a try/catch block, and make sure you call `rollbackTransaction` in the catch section.

```
const deleteProductSkus = require("../../queries/deleteProductSkus");
const deleteProduct = require("../../queries/deleteProduct");

const {
  startTransaction,
  commitTransaction,
  rollbackTransaction
} = require("~root/database");

const removeBundle = async ({ productId }) => {
  try {
    await startTransaction();

    await deleteProductSkus({
      productId
    });

    await deleteProduct({ productId });

    await commitTransaction();
  } catch (err) {
    await rollbackTransaction();
    throw new Error("Failed to delete product");
  }
};

module.exports = removeBundle;
```

### camelKeys

By convention SQL developers tend to use **snake_case** whilst naming column and table names, whereas JavaScript developers tend to prefer **camelCase** in their code. camelKeys helper converts snake_case column names to camelCase when using SELECT queries.

```
const { submitQuery, camelKeys } = require("~root/database");

const selectServiceLevels = () => submitQuery`
  SELECT 
     service_level, 
     priority_score
  FROM service_levels
`;

module.exports = camelKeys(selectServiceLevels);
```

Returned data from the above query will look like:

```
[ 
  { serviceLevel: 1, priorityScore: 10 },
  { serviceLevel: 2, priorityScore: 30 }
]
```

### getFirst

This helper is used when you want to **query just a single record** from a table. Instead of getting an array of values, your query will return a single object -- the first row from the resultset.

```
const { submitQuery, getFirst } = require("~root/database");

const selectUserName = ({ userId }) => submitQuery`
  SELECT 
     user_id,
     name 
  FROM users 
  WHERE user_id = ${userId}
`;

module.exports = getFirst(selectUser);
```

Above query will return

```
{ user_id: 1, name: "ersel" }
```

You can also pick a single column from the resulting row, by supplying a second argument to the getFirst helper.

```
module.exports = getFirst(selectUser, "name");
```

The above query will return `ersel` (a string value).

### getProperty

This helper is useful when you want to fetch an array of values from the target table and column.

```
const { submitQuery, getProperty } = require("~root/database");

const selectUserNames = () => submitQuery`
  SELECT 
     name 
  FROM users
`;

module.exports = getProperty(selectUserNames, "name");
```

Above query will return an array of strings.

```
["ersel", "buse", "kemal"]
```

### getInstertIds

This helper is used to get the ID of the last inserted record.

```
const { submitQuery, getInsertId } = require("~root/database");

const insertCycle = ({ systemId }) => submitQuery`
  INSERT INTO cycles(
    system_id
  ) VALUES(
    ${systemId}
  )
`;

module.exports = getInsertId(insertCycle);
```

**Usage:**

```
const insertedCycleId = await insertCycle({ systemId: 1 });
// insertedCycleId will be the primary key of the last inserted record in cycles table
```

### getInsertId

You can also get the insert ids of multiple insert values.

```
const { submitQuery, sql, getInsertIds, toCSV } = require("~root/database");

const insertReadings = ({ systemId, readings }) => submitQuery`
  INSERT INTO readings(
    system_id,
    system_type_metric_id,
    time_from,
    time_to,
    reading
  ) VALUES 
    ${readings
      .map(reading => {
        return sql`(
          ${systemId},
          ${reading.systemTypeMetricId},
          ${reading.timeFrom},
          ${reading.timeTo},
          ${reading.reading}
        )`;
      })
      .reduce(toCSV)}
`;

module.exports = getInsertIds(insertReadings);
```

### toCSV

This helper is used to concatenate sql statements as comma seperated values. Useful when you're doing a queries with `IN()` operator.

```
const { submitQuery, toCSV } = require("~root/database");

const deleteReadings = ({ readingIds }) => submitQuery`
  DELETE FROM
    readings
  WHERE
    reading_id IN(${readingIds.reduce(toCSV)})
`;

module.exports = deleteReadings;
```

**Usage:**

```
await deleteReadings({ readingIds: [1,2,3] }); // reading records with ids 1,2,3, will be deleted
```

### ToUnionAll

This helper is used to construct multiple select statements with UNION ALL operatior between.

```
const {
  submitQuery,
  sql,
  sqlReduceWithUnion,
  sqlValueOrNull
} = require("~root/database");

const insertMatchedProducts = ({ products, clientSalesChannelId }) => {
  return submitQuery`
    INSERT INTO client_sales_channel_product_mapping(
      product_id,
      client_sales_channel_id,
      sales_channel_product_ref,
      client_sales_channel_listing_id,
      fulfilment_opt_in,
      stock_sync_opt_in
    )
    ${products
      .map(product => {
        return sql`
          SELECT
            ${product.productId} AS product_id,
            ${clientSalesChannelId} AS client_sales_channel_id,
            ${product.productRef} AS sales_channel_product_ref,
            ${sqlValueOrNull(
              product.clientSalesChannelListingId
            )} AS client_sales_channel_listing_id,
            clients.fulfilment_opt_in_default,
            clients.stock_sync_opt_in_default
          FROM
            client_sales_channels
          LEFT JOIN
            client_integrations
          ON
            client_sales_channels.client_integration_id = client_integrations.client_integration_id
          LEFT JOIN
            clients
          ON
            clients.client_id = client_integrations.client_id
          WHERE
            client_sales_channel_id = ${clientSalesChannelId}
        `;
      })
      .reduce(sqlReduceWithUnion)}
    ON DUPLICATE KEY UPDATE
      product_id = VALUES(product_id),
      client_sales_channel_listing_id = VALUES(client_sales_channel_listing_id)
  `;
};

module.exports = insertMatchedProducts;
```

### Nest

**nest** helper is used when you want to generate a nested query output from a resultset with multiple join statements. You can nest as many levels by providing multiple array items.

`mergeField` attribute sets the column to be used for nesting.
`childrenLabel` attribute sets the key for the nested objects.
`fieldsToKeep` attribute determines the columns that will be kept under that nest branch.

```
const { submitQuery, nest, camelKeys } = require("~root/lib/database");

const selectBlogsByTag = ({ userId }) => submitQuery`
    SELECT     
        blogs.blog_id,
        blogs.user_id,
        blogs.category_id,
        blogs.description,
        blogs.image,
        blogs.slug,
        blogs.title,
        blogs.blog_content,
        blogs.updated_at,
        blogs.published_at,
        tags.tag
    FROM blogs
    LEFT JOIN blog_tags ON blog_tags.blog_id = blogs.blog_id
    LEFT JOIN tags ON tags.tag_id = blog_tags.tag_id
    WHERE blogs.user_id = ${userId}
`;

module.exports = nest(camelKeys(selectBlogsByTag), [
  {
    mergeField: "blogId",
    childrenLabel: "tags",
    fieldsToKeep: [
      "userId",
      "blogContent",
      "categoryId",
      "description",
      "image",
      "publishedAt",
      "slug",
      "title",
      "updatedAt"
    ]
  }
]);
````
