const { sql, sqlId, sqlReduce } = require("~root/lib/database");
const FILTERS = require("../constants/filtersList");

function filterData({ query = [], filterableAttributes }) {
  // Base case: If the query is an object with a 'column', 'operation', and 'values'
  if (query.column && query.operation) {
    switch (query.operation) {
      case FILTERS.equals.operator:
        return sql`${sqlId(query.column)} = ${query.values[0]}`;
      case FILTERS.notEquals.operator:
        return sql`${sqlId(query.column)} <> ${query.values[0]}`;
      case FILTERS.greaterThan.operator:
        return sql`${sqlId(query.column)} > ${query.values[0]}`;
      case FILTERS.greaterThanOrEqual.operator:
        return sql`${sqlId(query.column)} >= ${query.values[0]}`;
      case FILTERS.lessThan.operator:
        return sql`${sqlId(query.column)} < ${query.values[0]}`;
      case FILTERS.lessThanOrEqual.operator:
        return sql`${sqlId(query.column)} <= ${query.values[0]}`;
      case FILTERS.isNull.operator:
        return sql`${sqlId(query.column)} IS NULL`;
      case FILTERS.isNotNull.operator:
        return sql`${sqlId(query.column)} IS NOT NULL`;
      case FILTERS.in.operator:
        return sql`${sqlId(query.column)} IN (${query.values.reduce(
          sqlReduce
        )})`;
      case FILTERS.notIn.operator:
        return sql`${sqlId(query.column)} NOT IN (${query.values.reduce(
          sqlReduce
        )})`;
      case FILTERS.between.operator:
        return sql`${sqlId(query.column)} BETWEEN ${query.values[0]} AND ${
          query.values[1]
        }`;
      case FILTERS.isDateAfter.operator:
        return sql`${sqlId(query.column)} > ${query.values[0]}`;
      case FILTERS.isDateOnOrAfter.operator:
        return sql`${sqlId(query.column)} >= ${query.values[0]}`;
      case FILTERS.isDateBefore.operator:
        return sql`${sqlId(query.column)} < ${query.values[0]}`;
      case FILTERS.isDateOnOrBefore.operator:
        return sql`${sqlId(query.column)} <= ${query.values[0]}`;
      case FILTERS.isDateBetween.operator:
        return sql`${sqlId(query.column)} BETWEEN ${query.values[0]} AND ${
          query.values[1]
        }`;
      case FILTERS.contains.operator:
        return sql`${sqlId(query.column)} LIKE %${query.values[0]}%`;
      case FILTERS.startsWith.operator:
        return sql`${sqlId(query.column)} LIKE ${query.values[0]}%`;
      case FILTERS.endsWith.operator:
        return sql`${sqlId(query.column)} LIKE %${query.values[0]}`;
      case FILTERS.containsIgnoreCase.operator:
        return sql`LOWER(${sqlId(
          query.column
        )}) LIKE %${query.values[0].toLowerCase()}%`;
      case FILTERS.startsWithIgnoreCase.operator:
        return sql`LOWER(${sqlId(
          query.column
        )}) LIKE ${query.values[0].toLowerCase()}%`;
      case FILTERS.endsWithIgnoreCase.operator:
        return sql`LOWER(${sqlId(
          query.column
        )}) LIKE %${query.values[0].toLowerCase()}`;
      case FILTERS.matchesRegExp.operator:
        return sql`${sqlId(query.column)} REGEXP ${query.values[0]}`;
      default: {
        // user is trying to apply a custom filter
        const filterColumn = filterableAttributes.find(
          f => f.column === query.column
        );
        if (filterColumn) {
          const operationToApply = filterColumn.operations.find(
            op => op.operator === query.operation
          );
          if (operationToApply && operationToApply.filterFn) {
            return operationToApply.filterFn(query.values);
          }
        }

        // eslint-disable-next-line no-console
        console.error(
          `Unsupported filter criteria ${query.operation} ${query.column}`
        );
        return sql`1 = 1`;
      }
    }
  }

  // Recursive case: If the query is an object with 'AND' or 'OR' operators
  if (query.AND) {
    return query.AND.reduce((result, subQuery, index) => {
      const subqueryFiltered = filterData({
        query: subQuery,
        filterableAttributes
      });
      if (index + 1 === query.AND.length) {
        return sql`${result} ${subqueryFiltered})`;
      }
      return sql`${result} ${subqueryFiltered} AND`;
    }, sql`(`);
  }

  if (query.OR) {
    return query.OR.reduce((result, subQuery, index) => {
      const subqueryFiltered = filterData({
        query: subQuery,
        filterableAttributes
      });
      if (index + 1 === query.OR.length) {
        return sql`${result} ${subqueryFiltered})`;
      }
      return sql`${result} ${subqueryFiltered} OR`;
    }, sql`(`);
  }

  if (query.length) {
    return query.reduce((result, subQuery, index) => {
      const subqueryFiltered = filterData({
        query: subQuery,
        filterableAttributes
      });
      if (index + 1 === query.length) {
        return sql`${result} ${subqueryFiltered})`;
      }
      return sql`${result} ${subqueryFiltered} AND`;
    }, sql`(`);
  }

  return sql``;
}

const baseQuery = ({ filters, filterableAttributes }) => {
  const filterConditions = filterData({ query: filters, filterableAttributes });
  if (filterConditions.length > 1) {
    return sql`WHERE 1 = 1 AND ${filterConditions}`;
  }

  return sql`WHERE 1 = 1`;
};

module.exports = baseQuery;
