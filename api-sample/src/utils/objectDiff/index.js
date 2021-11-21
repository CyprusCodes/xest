/* eslint-disable no-prototype-builtins */
const objectDiff = (obj1, obj2) => {
  const diffs = {};

  const compare = (item1, item2, key) => {
    if (item1 !== item2) {
      diffs[key] = item2;
    }
  };

  let key;

  for (key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      compare(obj1[key], obj2[key], key);
    }
  }

  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }

  return diffs;
};

module.exports = objectDiff;
