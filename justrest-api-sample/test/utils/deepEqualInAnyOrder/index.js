/* eslint-disable no-console */
const isEqual = require("lodash/isEqual");
const sinon = require("sinon");
const jsonDiff = require("json-diff");
const sortDeep = require("../../../src/utils/sortDeep");

const deepEqualInAnyOrder = expectation =>
  sinon.match(object => {
    const sortedValue = sortDeep(object);
    const sortedExpectation = sortDeep(expectation);
    const result = isEqual(sortedValue, sortedExpectation);
    if (result) {
      return true;
    }
    console.log(
      `Expected value and given value do not match. Please investigate:`
    );
    console.log(jsonDiff.diffString(sortedValue, sortedExpectation));
    return false;
  }, "spy was not called with expected arguments");

module.exports = deepEqualInAnyOrder;
