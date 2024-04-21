/* eslint-disable prefer-destructuring */
const { sql, sqlId } = require("~root/lib/database");

const getComparisonSign = (paginationDirection, columnSortDirection) => {
  // Define the default comparison sign as '>'
  let comparisonSign = sql`>`;
  let comparisonSignStr = ">";

  if (
    columnSortDirection.toString() === "DESC" ||
    columnSortDirection.toString() === "desc"
  ) {
    // If the column is sorted in descending order, switch to '<'
    comparisonSign = sql`<`;
    comparisonSignStr = "<";
  }

  if (paginationDirection === "previous") {
    comparisonSign = comparisonSignStr === ">" ? sql`<` : sql`>`;
  }

  return comparisonSign;
};

const generateCondition = (column, value, comparisonSign) => {
  // https://github.com/rmosolgo/graphql-ruby/issues/2284
  if (value === null || value === undefined) {
    return sql`${sqlId(column)} IS NOT NULL`;
  }
  return sql`${sqlId(column)} ${comparisonSign} ${value}`;
};

const generateMultiColumnPaginationCursor = ({
  direction,
  cursorValues,
  orderBy
}) => {
  let query = sql``;
  const cursorValuesSortedBySortOrder = orderBy.map(o => {
    const cursorValue = cursorValues.find(c => {
      return c.column === o.column;
    });

    return {
      ...cursorValue,
      comparisonSign: getComparisonSign(direction, o.direction)
    };
  });

  cursorValuesSortedBySortOrder.forEach((cursor, index) => {
    if (index === 0) {
      query = sql`${query} (${generateCondition(
        cursor.column,
        cursor.value,
        cursor.comparisonSign
      )}) `;
    } else {
      query = sql`${query}OR (`;
      for (let i = 0; i <= index; i += 1) {
        const column = cursorValuesSortedBySortOrder[i].column;
        const value = cursorValuesSortedBySortOrder[i].value;
        const comparisonSign = cursorValuesSortedBySortOrder[i].comparisonSign;

        if (i === index) {
          query = sql`${query}${generateCondition(
            column,
            value,
            comparisonSign
          )}`;
        } else {
          query = sql`${query}${generateCondition(column, value, sql`=`)} AND `;
        }
      }
      query = sql`${query}) `;
    }
  });

  return sql`AND (${query})`;
};

module.exports = generateMultiColumnPaginationCursor;
