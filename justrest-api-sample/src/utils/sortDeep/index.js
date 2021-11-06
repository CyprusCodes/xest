const sortAny = require("sort-any");
const mapValues = require("lodash/mapValues");

const sortDeep = object => {
  if (!Array.isArray(object)) {
    if (!(typeof object === "object") || object === null) {
      return object;
    }

    return mapValues(object, sortDeep);
  }

  return sortAny(object.map(sortDeep));
};

module.exports = sortDeep;
