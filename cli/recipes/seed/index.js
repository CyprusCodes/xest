const inquirer = require("inquirer");
const flatten = require("lodash/flatten");
const get = require("lodash/get");
const uniqBy = require("lodash/uniqBy");
const { format } = require("sql-formatter");
const isEmpty = require("lodash/isEmpty");
const orderBy = require("lodash/orderBy");
const TableSelector = require("../../components/TableSelector");
const useForm = require("../../components/Form");
const Graph = require("../../utils/Graph");
const { getSchema, getForeignKeys } = require("../../utils/getSchema");
const chalk = require("chalk");
const getFakerMethods = require("./utils/fakerMethods");
const chooseDefaultSeedMethod = require("./utils/chooseDefaultSeedMethod");
const { getFakerExample, getFakerValue } = require("./utils/getFakerExample");
const leven = require("fast-levenshtein");
const quickScore = require("quick-score").quickScore;

module.exports = {
  name: "seed", // MUST match directory name
  userPrompt: async (projectRootPath) => {
    const schema = getSchema();
    if (!schema) {
      return;
    }

    const { addField, addArrayField, getAnswers } = useForm();

    const { add } = addArrayField((values) => {
      const tablesSelected = values.table || [];
      const existingForeignKeys = flatten(
        tablesSelected.map((table) => getForeignKeys(table))
      );
      const currentlySelectableTables = existingForeignKeys.map(
        (x) => x.foreignKeyTo.targetTable
      );

      const tablesToSelect = Object.keys(schema)
        .map((table) => ({
          name: table,
          value: table,
        }))
        .filter((c) => !(values.table || []).includes(c.name))
        .filter((c) => {
          if ((values.table || []).length > 0) {
            return currentlySelectableTables.find((st) => st === c.name);
          }
          return true;
        });

      return TableSelector({
        tables: tablesToSelect,
        onReply: async (tableNameSelected) => {
          // get all foreign keys of all selected tables
          const newForeignKeys = getForeignKeys(tableNameSelected);
          const allForeignKeys = uniqBy(
            [...newForeignKeys, ...existingForeignKeys],
            (check) => `${check.table}.${check.column}`
          );
          const selectableTables = allForeignKeys.map(
            (x) => x.foreignKeyTo.targetTable
          );
          const areThereAnyOtherTablesToJoin = selectableTables.some(
            (table) => !tablesSelected.includes(table)
          );
          if (areThereAnyOtherTablesToJoin) {
            const hasSelectedTables = tablesSelected.length;
            console.log(
              `You will be seeding ${chalk.green`${
                hasSelectedTables ? tablesSelected.join(",") : tableNameSelected
              }`}`
            );

            const result = await inquirer.prompt({
              type: "confirm",
              name: "addMore",
              message: chalk.yellow`Would you like to seed another table?`,
              default: "y",
            });
            if (result.addMore) {
              add();
            }
          }
        },
      });
    });

    addField((values) => {
      return {
        type: "input",
        name: "seedCount",
        message: "How many seed records do you want to create?",
        default: 1,
      };
    });

    console.log(chalk.green`=== SEEDER EXAMPLES ===\n https://fakerjs.dev/\n`);

    addArrayField((values) => {
      const tablesSelected = values.table;
      const columns = flatten(tablesSelected.map((table) => schema[table]));

      const seedableColumns = columns
        .filter((c) => c.extra !== "auto_increment")
        .filter((c) => isEmpty(c.foreignKeyTo));
      const seedFunctions = getFakerMethods();

      seedableColumns.forEach((column) => {
        const defaultValue = chooseDefaultSeedMethod(column);
        const seederChoicesOrderedByRelevance = seedFunctions
          .map((s) => {
            return {
              ...s,
              quickScore: quickScore(s.path, column.column),
              levenDistance: leven.get(s.path, column.column),
            };
          })
          .sort((a, b) => {
            if (a.quickScore > 0 || b.quickScore > 0) {
              return b.quickScore - a.quickScore;
            }

            return a.levenDistance - b.levenDistance;
          })
          .map((s) => {
            return {
              name: `${s.path}, e.g: ${s.sampleOutput}`,
              value: s.path,
            };
          });

        addField(() => {
          return {
            type: "search-list",
            name: `${column.table}.${column.column}`,
            message: `Choose seed generator for column: ${column.table}.${column.column}`,
            choices: [
              {
                name: `${defaultValue} e.g: ${getFakerExample(defaultValue)}`,
                value: defaultValue,
              },
              ...seederChoicesOrderedByRelevance,
            ],
            default: defaultValue,
          };
        });
      });
    });

    const responses = await getAnswers();
    return responses;
  },
  files: [
    {
      source: "queries/insert.js",
      targetFileNameMapper: () => {
        return "path";
      },
      targetFileWriter: async ({
        sourceFilePath,
        targetFilePath,
        userVariables,
      }) => {
        const schema = getSchema();
        if (!schema) {
          return;
        }

        const { table: tables, seedCount } = userVariables;
        let graph = new Graph();
        tables.forEach((tableName) => {
          graph.addVertex(tableName);
        });

        tables.forEach((sourceTableName) => {
          const foreignKeys = getForeignKeys(sourceTableName);
          // we are only interested in the foreign keys
          // user has decided to populate automatically
          // rest will be left as TODO comments for the programmer
          foreignKeys.forEach((fk) => {
            const targetTable = fk.foreignKeyTo.targetTable;
            if (tables.includes(targetTable)) {
              graph.addEdge(sourceTableName, targetTable);
            }
          });
        });

        const tablesToPopulate = tables.map((name) => {
          return {
            name,
            inDegree: graph.getIndegree(name),
          };
        });

        const finalTableToPopulate = tablesToPopulate.find(
          (t) => t.inDegree === 0
        );
        const tablesToPopulateWithDepths = tablesToPopulate.map((table) => {
          const pathExists = graph.doesPathExist(
            finalTableToPopulate.name,
            table.name
          );
          return {
            ...table,
            depth: pathExists.pathExists ? pathExists.path.length - 1 : 0,
          };
        });

        const insertedRecords = {};
        let insertSeedSQL = ``;
        const tablesToInsert = orderBy(
          tablesToPopulateWithDepths,
          ["depth"],
          ["desc"]
        );
        tablesToInsert.forEach((table) => {
          const { name } = table;
          const columns = schema[name];
          for (let i = 0; i < seedCount; i++) {
            const columnsToInsert = columns
              .map((column) => {
                const seederTemplate =
                  userVariables[`${column.table}.${column.column}`];
                const isItFK = !isEmpty(column.foreignKeyTo);
                const isAutoIncrement = column.extra === "auto_increment";
                if (isAutoIncrement) {
                  // this column will be filled automatically
                  return null;
                }

                let seed =
                  "NULL, -- todo: please fill above value, or drop this comment";
                if (isItFK) {
                  const targetTable = column.foreignKeyTo.targetTable;
                  // todo: might need lodash get here
                  // , if user decides to skip populating other tables on purpose
                  if (get(insertedRecords, `${targetTable}[${i}]`)) {
                    seed = `@${insertedRecords[targetTable][i]},`;
                  }
                }

                if (seederTemplate) {
                  let rawSeedValue = getFakerValue(seederTemplate);
                  if (isNaN(rawSeedValue)) {
                    seed = `"${rawSeedValue}",`;
                  } else {
                    seed = `${rawSeedValue},`;
                  }
                }
                return {
                  table: column.table,
                  column: column.column,
                  value: seed,
                };
              })
              .filter((v) => !!v);

            let sql = `\n\nINSERT INTO ${columnsToInsert[0].table}`;
            sql = sql + `(${columnsToInsert.map((v) => v.column).join(",")})`;

            let listOfColumns = columnsToInsert.map((v) => v.value).join("\n");
            if (listOfColumns[listOfColumns.length - 1] === ",") {
              listOfColumns = listOfColumns.slice(0, -1);
            }

            sql = sql + `VALUES (${listOfColumns}\n);`;
            sql =
              sql +
              `\nSET @${columnsToInsert[0].table}_${i + 1} = LAST_INSERT_ID();`;
            insertSeedSQL = insertSeedSQL + sql;
            if (insertedRecords[columnsToInsert[0].table]) {
              insertedRecords[columnsToInsert[0].table].push(
                `${columnsToInsert[0].table}_${i + 1}`
              );
            } else {
              insertedRecords[columnsToInsert[0].table] = [
                `${columnsToInsert[0].table}_${i + 1}`,
              ];
            }
          }
        });

        console.log(chalk.green`\nSEED MIGRATIONS BELOW:\n`);
        const formattedSQL = format(insertSeedSQL);
        const finalSQL = formattedSQL
          .replace(/@ /g, "@")
          .replace(/SET\s\s+/g, "SET ")
          .replace(/\_ID\(\);/g, "_ID();\n");
        console.log(finalSQL);

        console.log(
          chalk.green`You can use MySQL Workbench to test your migration script. Once happy copy and paste it to the database/seed-data.sql file.`
        );
        return true;
      },
    },
  ],
};
