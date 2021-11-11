const {
  camelCase,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
} = require("lodash");

const enrichEngine = (engine) => {
  engine.registerFilter("toCamelCase", (v) => camelCase(v));
  engine.registerFilter("toTitleCase", (v) => startCase(camelCase(v)));
  engine.registerFilter("toPascalCase", (v) =>
    startCase(camelCase(v)).replace(/ /g, "")
  );
  engine.registerFilter("toConstantCase", (v) =>
    upperCase(v).replace(/ /g, "_")
  );
  engine.registerFilter("toDotCase", (v) => lowerCase(v).replace(/ /g, "."));
  engine.registerFilter("toKebabCase", (v) => kebabCase(v));
  engine.registerFilter("toLowerCase", (v) => lowerCase(v).replace(/ /g, ""));
  engine.registerFilter("toPathCase", (v) => lowerCase(v).replace(/ /g, "/"));
  engine.registerFilter("toSnakeCase", (v) => snakeCase(v));
  engine.registerFilter("toSentenceCase", (v) => upperFirst(lowerCase(str)));
};

module.exports = enrichEngine;
