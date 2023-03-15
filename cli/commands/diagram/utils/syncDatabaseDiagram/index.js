const fs = require("fs-extra");
const path = require("path");
const {
  getSchema,
  getForeignKeys,
  getPrimaryKey,
} = require("../../../../utils/getSchema");
const flattenDeep = require("lodash/flattenDeep");
const getPreviousColumnComment = require("../getPreviousColumnComment");
const getPreviousTableComment = require("../getPreviousTableComment");

const syncDatabaseDiagram = ({ rootPath }) => {
  const diagramFile = path.join(rootPath, "./db-diagram.json");
  const doesItExist = fs.pathExistsSync(diagramFile);
  let diagramJSON = {};
  let previousDiagramJSON = {};

  if (!doesItExist) {
    try {
      const sampleFile = fs.readFileSync(path.join(__dirname, "./sample.json"));
      diagramJSON = JSON.parse(sampleFile);
    } catch (error) {
      console.log("Can't find sample diagram JSON file.");
      return;
    }
  } else {
    try {
      const existingFile = fs.readFileSync(diagramFile);
      diagramJSON = JSON.parse(existingFile);
      previousDiagramJSON = diagramJSON;
    } catch (error) {
      console.log(
        "Trouble reading db-diagram.json file. Is it malformed? Try deleting db-diagram.json and starting again"
      ).return;
    }
  }

  const databaseSchema = getSchema();
  const tables = Object.entries(databaseSchema).map(([tableName, columns]) => {
    let primaryKey = getPrimaryKey(tableName);
    let primarkKeyName = "";
    if (primaryKey) {
      primarkKeyName = primaryKey.column;
    }

    const tableComment = getPreviousTableComment(tableName, previousDiagramJSON);

    return {
      schema: "public",
      table: tableName,
      columns: columns.map((column) => {
        const columnComment = getPreviousColumnComment(tableName, column.column, previousDiagramJSON);

        return {
          name: column.column,
          type: column.columnnType,
          nullable: column.nullable,
          ...(columnComment
            ? {
                comment: columnComment,
              }
            : {}),
          origins: [
            {
              id: "98006620-7170-46c5-8740-3c9d395729a5",
              lines: [],
            },
          ],
        };
      }),
      uniques: [
        /** TODO: compute unique constraints */
      ],
      ...(primaryKey
        ? {
            primaryKey: {
              name: `${tableName}_pk`,
              columns: [primarkKeyName],
              origins: [
                {
                  id: "98006620-7170-46c5-8740-3c9d395729a5",
                  lines: [],
                },
              ],
            },
          }
        : {}),
      ...(tableComment
        ? {
            comment: tableComment,
          }
        : {}),
      origins: [
        {
          id: "98006620-7170-46c5-8740-3c9d395729a5",
          lines: [],
        },
      ],
    };
  });

  const tableNames = Object.keys(databaseSchema);
  const allForeignKeysDeep = tableNames
    .map((tableName) => getForeignKeys(tableName))
    .filter((fks) => fks.length > 0);
  const allForeignKeys = flattenDeep(allForeignKeysDeep);

  const relations = allForeignKeys.map((foreignKey) => {
    return {
      name: `${foreignKey.table}_${foreignKey.column}_fk`,
      src: {
        table: `public.${foreignKey.table}`,
        column: foreignKey.column,
      },
      ref: {
        table: `public.${foreignKey.foreignKeyTo.targetTable}`,
        column: foreignKey.foreignKeyTo.targetColumn,
      },
      origins: [
        {
          id: "98006620-7170-46c5-8740-3c9d395729a5",
          lines: [],
        },
      ],
    };
  });

  diagramJSON.sources["0"] = {
    ...diagramJSON.sources["0"],
    tables,
    relations,
  };
  fs.writeFileSync("./db-diagram.json", JSON.stringify(diagramJSON, null, 2));

  // todo: drop unrecognized tables and columns from layouts (give visual summary of whats dropped)
  // todo: nice to haves on schemas: unique constraint, indexes, composite pk
};

module.exports = syncDatabaseDiagram;
