const chipper = require("chipper/prog");
const flattenDeep = require("lodash/flattenDeep");
const get = require("lodash/get");
const fs = require("fs");

function filterNonExistentFilesAndSystemDependencies(filePaths) {
  const existingFiles = filePaths.filter(filePath => fs.existsSync(filePath));

  return existingFiles;
}

const scanDependencies = async (path, depth = 0, maxDepth, chipperOpts) => {
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

  const filteredResults = filterNonExistentFilesAndSystemDependencies(allResults);
  return Promise.resolve(filteredResults);
};

module.exports = scanDependencies;
