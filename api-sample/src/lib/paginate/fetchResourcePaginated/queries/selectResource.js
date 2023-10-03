const { submitQuery, sql, sqlId, sqlReduce } = require("~root/lib/database");
const unlimitedQuery = require("./unlimitedQuery");

const selectResource = ({
  baseTable,
  selectFields,
  joinStatements,
  groupBy,
  orderBy,
  page,
  direction,
  filters,
  cursorValues,
  limit,
  filterableAttributes
}) => {
  const query = sql`
    SELECT
      ${selectFields
        .map(field => {
          // eslint-disable-next-line no-underscore-dangle
          if (field._escaped_before) {
            return field;
          }
          return sql`${sqlId(field)} `;
        })
        .reduce(sqlReduce)}
    FROM
      ${sqlId(baseTable)}
      ${
        joinStatements.length ? sql`${joinStatements.reduce(sqlReduce)}` : sql``
      }
      ${unlimitedQuery({
        groupBy,
        orderBy,
        page,
        direction,
        filters,
        cursorValues,
        filterableAttributes
      })}
      LIMIT ${Number(limit)}
      `;

  // this subquery keeps sort order of each page consistent
  // regardless of pagination direction
  return submitQuery`
  SELECT * FROM(${query}) AS subquery
  ORDER BY
  ${orderBy
    .map(o => sql`subquery.${sqlId(o.column.split(".")[1])} ${o.direction}`)
    .reduce(sqlReduce)}`;
};

module.exports = selectResource;
