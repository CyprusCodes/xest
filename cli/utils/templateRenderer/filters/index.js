const {
  camelCase,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
  uniq,
} = require("lodash");
const { singular, plural } = require("pluralize");

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
  engine.registerFilter("singular", (v) => singular(v));
  engine.registerFilter("plural", (v) => plural(v));
  engine.registerFilter("functionParameters", (args) => {
    // assume we are passing an object parameter {}
    if (!args.length) {
      return "";
    }

    return `{ ${args.map((v) => camelCase(v)).join(",")} }`;
  });
  engine.registerFilter("sqlColumns", (fields) => {
    if (!fields.length) {
      return "";
    }

    // check if columns with same name exist
    let fieldList = [];
    const isUsingDotNotation = fields.find((field) => field.includes("."));
    if (isUsingDotNotation) {
      const originalFields = fields.map((field) => {
        const fieldDetails = field.split(".");
        return {
          table: fieldDetails[0],
          column: fieldDetails[1],
        };
      });
      fieldList = originalFields
        .map((field) => {
          // check for conflict
          const hasConflictingColumnName = originalFields.find(
            (checkField) => checkField.column === field.column
          );
          if (hasConflictingColumnName) {
            return {
              table: field.table,
              column: `${field.table}_${field.column}`,
            };
          }
        })
        .map((field) => `${field.table}.${field.column}`);
    } else {
      fieldList = uniq(fields);
    }

    return `${fieldList.map((v) => snakeCase(v)).join(",")}`;
  });
  engine.registerFilter("sqlFilters", (fields) => {
    if (!fields.length) {
      return "";
    }
    let fieldList = uniq(fields);
    return `WHERE ${fieldList.map((v) => snakeCase(v)).join(`${snakeCase(v)} = ${camelCase(v)},`)}`;
  });
};

module.exports = enrichEngine;
