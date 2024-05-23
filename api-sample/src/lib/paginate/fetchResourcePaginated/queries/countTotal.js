const {
  submitQuery,
  getFirst,
  sqlId,
  sqlReduce,
  sql
} = require("~root/lib/database");
const baseQuery = require("./baseQuery");

const countTotal = ({
  baseTable,
  joinStatements,
  filters,
  filterableAttributes,
  groupBy,
  mandatoryFilter
}) => submitQuery`
SELECT
  COUNT(*) AS total_count
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
  ${baseQuery({
    filters,
    filterableAttributes,
    mandatoryFilter
  })}
  ${
    groupBy.length
      ? sql`GROUP BY ${groupBy.map(c => sqlId(c)).reduce(sqlReduce)}`
      : sql``
  }
) AS base_query`;

module.exports = getFirst(countTotal, "total_count");
