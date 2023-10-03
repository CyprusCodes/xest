const {
  submitQuery,
  sqlId,
  sql,
  sqlReduce,
  getFirst
} = require("~root/lib/database");
const unlimitedQuery = require("./unlimitedQuery");

const countUnlimited = ({
  baseTable,
  joinStatements,
  groupBy,
  orderBy,
  page,
  direction,
  filters,
  cursorValues,
  filterableAttributes
}) => submitQuery`
  SELECT
    COUNT(*) AS count_unlimited_rows
  FROM(
    SELECT 
      ${sqlId(baseTable)}.*
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
  ) AS unlimited_query
`;

module.exports = getFirst(countUnlimited, "count_unlimited_rows");
