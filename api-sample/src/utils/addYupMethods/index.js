/* eslint-disable func-names */
const yup = require("yup");
const get = require("lodash/get");

yup.addMethod(yup.array, "unique", function(message, path) {
  return this.test("unique", message, function(list) {
    if (!Array.isArray(list)) {
      return false;
    }
    const mapper = x => get(x, path);
    const set = [...new Set(list.map(mapper))];
    const isUnique = list.length === set.length;
    if (isUnique) {
      return true;
    }

    const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    let arrayPath = `[${idx}].${path}`;
    if (this.path) {
      arrayPath = `${this.path}[${idx}].${path}`;
    }
    return this.createError({ path: arrayPath, message });
  });
});

yup.addMethod(yup.array, "uniqueIfSupplied", function(
  message,
  path,
  opts = { skipNulls: false }
) {
  return this.test("unique", message, function(list) {
    if (!Array.isArray(list)) {
      return false;
    }
    const mapper = x => get(x, path);
    let set;
    let listToCheck;
    if (opts.skipNulls) {
      listToCheck = list.filter(i => mapper(i) === null);
      set = [...new Set(list.filter(i => mapper(i) === null))];
    } else {
      listToCheck = list;
      set = [...new Set(list.map(mapper))];
    }

    const isUnique = listToCheck.length === set.length;
    const notSupplied = set.length === 1 && set[0] === undefined;
    if (isUnique || notSupplied) {
      return true;
    }

    const idx = listToCheck.findIndex((l, i) => mapper(l) !== set[i]);
    let arrayPath = `[${idx}].${path}`;
    if (this.path) {
      arrayPath = `${this.path}[${idx}].${path}`;
    }
    return this.createError({ path: arrayPath, message });
  });
});

yup.addMethod(yup.array, "uniqueArray", function(message) {
  return this.test("unique", message, function(list) {
    if (!Array.isArray(list)) {
      return false;
    }
    const set = [...new Set(list)];
    const isUnique = list.length === set.length;
    if (isUnique) {
      return true;
    }
    const idx = list.findIndex((l, i) => l !== set[i]);
    let arrayPath = `[${idx}]`;
    if (this.path) {
      arrayPath = `${this.path}[${idx}]`;
    }
    return this.createError({ path: arrayPath, message });
  });
});
