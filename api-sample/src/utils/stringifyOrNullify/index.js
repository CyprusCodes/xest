const stringifyOrNullify = array => {
  if (array.length > 0) {
    return JSON.stringify(array);
  }
  return null;
};

module.exports = stringifyOrNullify;
