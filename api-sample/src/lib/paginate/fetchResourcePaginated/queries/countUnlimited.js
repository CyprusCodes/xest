const { submitQuery, sqlId, sql, getFirst } = require("~root/lib/database");
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
  filterableAttributes,
  mandatoryFilter
}) => submitQuery`
  SELECT
    COUNT(*) AS count_unlimited_rows
  FROM(
    SELECT 
      1
    FROM
      ${sqlId(baseTable)}
      ${
        joinStatements.length
          ? sql`${joinStatements.reduce((a, c) => sql`${a} ${c}`)}`
          : sql``
      }
    ${unlimitedQuery({
      groupBy,
      orderBy,
      page,
      direction,
      filters,
      cursorValues,
      filterableAttributes,
      mandatoryFilter
    })}
  ) AS unlimited_query
`;

module.exports = getFirst(countUnlimited, "count_unlimited_rows");
