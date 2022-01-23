const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const flatten = require("lodash/flatten");
const uniqBy = require("lodash/uniqBy");
const TableSelector = require("../../components/TableSelector");
const useForm = require("../../components/Form");
const Graph = require("../../utils/Graph");
const { writeFile } = require("../../utils/createFile");
const { getSchema, getForeignKeys } = require("../../utils/getSchema");
const chalk = require("chalk");
const render = require("../../utils/templateRenderer");
const prettifyFile = require("../../utils/prettifyFile");
const getFakerMethods = require("./utils/fakerMethods");
const chooseDefaultSeedMethod = require("./utils/chooseDefaultSeedMethod");
const getFakerExample = require("./utils/getFakerExample");
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

    console.log(
      chalk.green`=== SEEDER EXAMPLES ===\n https://rawgit.com/Marak/faker.js/master/examples/browser/index.html\n`
    );

    addArrayField((values) => {
      const tablesSelected = values.table;
      const columns = flatten(tablesSelected.map((table) => schema[table]));

      const seedableColumns = columns
        .filter((c) => c.columnKey !== "PRI")
        .filter((c) => c.columnKey !== "MUL");
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
        const { crudType, entityName, table, columns, filterColumns } =
          userVariables;

        // date mapping -> https://stackoverflow.com/a/9035732
        console.log({ userVariables });
        const { table: tables } = userVariables;
        let graph = new Graph();
        tables.forEach((tableName) => {
          console.log(tableName);
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
        const tablesToPopulateInOrder = tablesToPopulate.map((table) => {
          const pathExists = graph.doesPathExist(
            finalTableToPopulate.name,
            table.name
          );
          return {
            ...table,
            depth: pathExists.pathExists ? pathExists.path.length - 1 : 0,
          };
        });
        console.log("Final table:", finalTableToPopulate);
        console.log("Depths", tablesToPopulateInOrder);

        console.log(chalk.green`Succesfully created \n${targetFilePath}`);
        return true;
      },
    },
  ],
};
