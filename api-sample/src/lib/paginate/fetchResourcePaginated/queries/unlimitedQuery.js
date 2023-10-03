const { sql, sqlId, sqlReduce } = require("~root/lib/database");
const revertSortDirection = require("../utils/reverseSortDirection");
const generateMultiColumnPaginationCursor = require("../utils/generateMultiColumnPaginationCursor");
const baseQuery = require("./baseQuery");

const unlimitedQuery = ({
  groupBy,
  orderBy,
  page,
  direction,
  filters,
  cursorValues,
  filterableAttributes
}) => {
  let query = baseQuery({
    filters,
    filterableAttributes
  });

  if (page === "last") {
    query = sql`
      ${query}  
      ${
        groupBy.length
          ? sql`GROUP BY ${groupBy.map(c => sqlId(c)).reduce(sqlReduce)}`
          : sql``
      }
      ORDER BY
        ${orderBy
          .map(o => sql`${sqlId(o.column)} ${revertSortDirection(o.direction)}`)
          .reduce(sqlReduce)}`;
  } else if (cursorValues.length && direction === "next") {
    query = sql`
      ${query}  
      ${generateMultiColumnPaginationCursor({
        direction,
        cursorValues,
        orderBy
      })}
      ${
        groupBy.length
          ? sql`GROUP BY ${groupBy.map(c => sqlId(c)).reduce(sqlReduce)}`
          : sql``
      }
      ORDER BY
        ${orderBy
          .map(o => sql`${sqlId(o.column)} ${o.direction}`)
          .reduce(sqlReduce)}`;
  } else if (cursorValues.length && direction === "previous") {
    query = sql`
      ${query} 
      ${generateMultiColumnPaginationCursor({
        direction,
        cursorValues,
        orderBy
      })}
      ${
        groupBy.length
          ? sql`GROUP BY ${groupBy.map(c => sqlId(c)).reduce(sqlReduce)}`
          : sql``
      }
      ORDER BY
        ${orderBy
          .map(o => sql`${sqlId(o.column)} ${revertSortDirection(o.direction)}`)
          .reduce(sqlReduce)}`;
  } else {
    query = sql`
      ${query}
      ${
        groupBy.length
          ? sql`GROUP BY ${groupBy.map(c => sqlId(c)).reduce(sqlReduce)}`
          : sql``
      }
      ORDER BY
        ${orderBy
          .map(o => sql`${sqlId(o.column)} ${o.direction}`)
          .reduce(sqlReduce)}`;
  }

  return query;
};

module.exports = unlimitedQuery;
