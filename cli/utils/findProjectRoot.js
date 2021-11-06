const isEmpty = require("lodash/isEmpty");
const get = require("lodash/get");
const finder = require("find-package-json");

const findJustRestProjectRoot = () => {
  let found = false;
  let f = finder(process.cwd());
  let projectRoot = { done: false };
  while (!found && projectRoot.done === false) {
    projectRoot = f.next();
    found = !isEmpty(get(projectRoot, "value.justrest", {}));
  }

  if (found) {
    return projectRoot;
  }
  return false;
};

module.exports = findJustRestProjectRoot;
