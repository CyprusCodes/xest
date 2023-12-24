const chipper = require("chipper/prog");
const flattenDeep = require("lodash/flattenDeep");
const get = require("lodash/get");
const fs = require("fs");

const scanDependencies = async (path, depth = 0, maxDepth, chipperOpts) => {
  console.log(`scanning for ${path}`);
  const results = await chipper.exec(["dependencies", path], chipperOpts);

  const dependents = get(results, "[0].importedModules", []);
  let fileResults = [];

  if (dependents.length && depth < maxDepth) {
    fileResults = await Promise.all(
      dependents.map((d) =>
        scanDependencies(d.absolute, depth + 1, maxDepth, chipperOpts)
      )
    );
  }

  const allResults = [
    ...dependents.map((d) => d.absolute),
    ...flattenDeep(fileResults),
  ];

  return Promise.resolve(allResults);
};

module.exports = scanDependencies;
