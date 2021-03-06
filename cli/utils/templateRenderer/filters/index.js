const {
  camelCase,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
  uniq,
  get,
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

    const isUsingDotNotation = args.find((field) => field.includes("."));
    if (isUsingDotNotation) {
      return `{ ${args.map((v) => camelCase(v.split(".")[1])).join(",")} }`;
    }

    return `{ ${args.map((v) => camelCase(v)).join(",")} }`;
  });
  engine.registerFilter("sqlColumns", (fields, schema) => {
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
          const conflictingField = originalFields.find((checkField) => {
            return (
              checkField.column === field.column &&
              checkField.table !== field.table
            );
          });

          if (conflictingField) {
            const fieldDetails = schema[field.table].find(
              (c) => c.column === field.column
            );
            if (
              get(fieldDetails, "foreignKeyTo.targetTable") ===
              conflictingField.table
            ) {
              // this is just a FK to other field, so we can keep it
              return field;
            }
            const conflictingFieldDetails = schema[conflictingField.table].find(
              (c) => c.column === conflictingField.column
            );
            if (
              get(conflictingFieldDetails, "foreignKeyTo.targetTable") ===
              field.table
            ) {
              // this is the target of FK field, so we can skip it
              return null;
            }

            // this is a legitimate name conflict
            // and these fields are not associated with each other, so rename them
            return {
              table: field.table,
              column: `${field.table}_${field.column}`,
            };
          }
          return field;
        })
        .filter((v) => !!v)
        .map((field) => `${field.table}.${field.column}`);
    } else {
      fieldList = uniq(fields);
    }

    return `${fieldList.join(",")}`;
  });

  engine.registerFilter("sqlFilters", (fields) => {
    if (!fields.length) {
      return "";
    }
    let fieldList = uniq(fields);

    return `WHERE ${fieldList
      .map((v) => `${v} = \${${camelCase(v.split(".")[1])}\}`)
      .join(",")}`;
  });

  engine.registerFilter("sqlVariables", (fields) => {
    if (!fields.length) {
      return "";
    }
    let fieldList = uniq(fields);
    const isUsingDotNotation = fields[0].includes(".");

    if (isUsingDotNotation) {
      return `${fieldList
        .map((v) => `\${${camelCase(v.split(".")[1])}\}`)
        .join(",")}`;
    }
    return `${fieldList.map((v) => `\${${camelCase(v)}\}`).join(",")}`;
  });

  engine.registerFilter("sqlUpdateParams", (fields) => {
    if (!fields.length) {
      return "";
    }
    let fieldList = uniq(fields);
    const isUsingDotNotation = fields[0].includes(".");

    if (isUsingDotNotation) {
      return `${fieldList
        .map((v) => `${v} = \${${camelCase(v.split(".")[1])}\}`)
        .join(",")}`;
    }
    return `${fieldList.map((v) => `${v} = \${${camelCase(v)}\}`).join(",")}`;
  });

  engine.registerFilter("joinGenerator", (tables, schema) => {
    if (tables.length <= 1) {
      return ``;
    }
    const joinedSoFar = [tables[0]]; // first table is used by the FROM
    const joinSQL = (sourceTable, targetTable, sourceColumn, targetColumn) =>
      `LEFT JOIN ${targetTable} ON ${sourceTable}.${sourceColumn} = ${targetTable}.${targetColumn}`;
    let joins = ``;
    const tablesToJoin = tables.slice(1);
    tablesToJoin.forEach((targetTable) => {
      joinedSoFar.forEach((joinedTable) => {
        const targetColumn = schema[joinedTable].find(
          (column) => get(column, "foreignKeyTo.targetTable") === targetTable
        );
        if (targetColumn) {
          joins =
            joins +
            joinSQL(
              joinedTable,
              targetColumn.foreignKeyTo.targetTable,
              targetColumn.column,
              targetColumn.foreignKeyTo.targetColumn
            );
          joinedSoFar.push(targetColumn.foreignKeyTo.targetTable);
        }
      });
    });
    return joins;
  });
};

module.exports = enrichEngine;
