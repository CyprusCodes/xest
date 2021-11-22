const faker = require("faker");
const flattenDeep = require("lodash/flattenDeep");

const trimSampleOutput = (output) => {
    let string = output.replace((/  |\r\n|\n|\r/gm),"").replace(/\\"/g, '"');
    if (string.length > 80) {
        return string.substring(0, 77) + "...";
      }
    return string;
}

const constructSeederPath = (path, method) => {
  if (typeof method === "function") {
    const deprecatedPaths = [
      "random.number",
      "random.float",
      "random.uuid",
      "random.boolean",
      "random.hexaDecimal",
    ];
    if (deprecatedPaths.includes(path)) {
      return null;
    }
    let sampleOutput = "";
    try {
      sampleOutput = method();
    } catch (err) {
      console.error(`Seeder ${path} IS NO LONGER SUPPORTED.`);
    }

    return {
      path,
      sampleOutput: trimSampleOutput(JSON.stringify(sampleOutput)),
    };
  } else {
    return Object.entries(method).map(([methodName, method]) => {
      return constructSeederPath(`${path}.${methodName}`, method);
    });
  }
};

const getFakerMethods = () => {
  const allMethods = Object.entries(faker)
    .filter(([key]) => {
      const hide = [
        "locales",
        "locale",
        "localeFallback",
        "definitions",
        "fake",
        "unique",
        "mersenne",
        "helpers",
      ];
      return !hide.includes(key);
    })
    .map(([key, methods]) => {
      return constructSeederPath(key, methods);
    });

  return flattenDeep(allMethods).filter((v) => !!v);
};

module.exports = getFakerMethods;
