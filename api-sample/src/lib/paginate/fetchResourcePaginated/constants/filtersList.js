const FILTERS = {
  equals: {
    operator: "equals",
    description: "Equal to the specified value",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  notEquals: {
    operator: "notEquals",
    description: "Not equal to the specified value",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  greaterThan: {
    operator: "greaterThan",
    description: "Greater than the specified value",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  greaterThanOrEqual: {
    operator: "greaterThanOrEqual",
    description: "Greater than or equal to the specified value",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  lessThan: {
    operator: "lessThan",
    description: "Less than the specified value",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  lessThanOrEqual: {
    operator: "lessThanOrEqual",
    description: "Less than or equal to the specified value",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  isNull: {
    operator: "isNull",
    description: "Is null",
    minimumNumberOfOperands: 0,
    maximumNumberOfOperands: 0
  },
  isNotNull: {
    operator: "isNotNull",
    description: "Is not null",
    minimumNumberOfOperands: 0,
    maximumNumberOfOperands: 0
  },
  in: {
    operator: "in",
    description: "is in the given list of values",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 9999
  },
  notIn: {
    operator: "notIn",
    description: "is not in the given list of values",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 9999
  },
  between: {
    operator: "between",
    description: "is between given values",
    minimumNumberOfOperands: 2,
    maximumNumberOfOperands: 2
  },
  isDateAfter: {
    operator: "isDateAfter",
    description: "is after given date",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  isDateOnOrAfter: {
    operator: "isDateOnOrAfter",
    description: "is after or on given date",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  isDateBefore: {
    operator: "isDateBefore",
    description: "is before given date",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  isDateOnOrBefore: {
    operator: "isDateOnOrBefore",
    description: "is before or on given date",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  isDateBetween: {
    operator: "isDateBetween",
    description: "is date between the given two dates",
    minimumNumberOfOperands: 2,
    maximumNumberOfOperands: 2
  },
  contains: {
    operator: "contains",
    description: "contains the given string",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  startsWith: {
    operator: "startsWith",
    description: "starts with the given string",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  endsWith: {
    operator: "endsWith",
    description: "ends with the given string",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  containsIgnoreCase: {
    operator: "containsIgnoreCase",
    description: "contains the given string ignoring case",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  startsWithIgnoreCase: {
    operator: "startsWithIgnoreCase",
    description: "starts with the given string ignoring case",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  endsWithIgnoreCase: {
    operator: "endsWithIgnoreCase",
    description: "ends with the given string ignoring case",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  },
  matchesRegExp: {
    operator: "matchesRegExp",
    description: "matches the regular expression given",
    minimumNumberOfOperands: 1,
    maximumNumberOfOperands: 1
  }
};

module.exports = FILTERS;
