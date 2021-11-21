const inquirer = require("inquirer");
const fs = require("fs");
const faker = require("faker");
const path = require("path");
const startCase = require("lodash/startCase");
const camelCase = require("lodash/camelCase");
const flatten = require("lodash/flatten");
const uniqBy = require("lodash/uniqBy");
const TableSelector = require("../../components/TableSelector");
const ColumnSelector = require("../../components/ColumnSelector");
const useForm = require("../../components/Form");
const { writeFile } = require("../../utils/createFile");
const {
  getSchema,
  getPrimaryKey,
  getForeignKeys,
} = require("../../utils/getSchema");
const chalk = require("chalk");
const render = require("../../utils/templateRenderer");
const prettifyFile = require("../../utils/prettifyFile");
const getFakerMethods = require("./utils/fakerMethods");
const chooseDefaultSeedMethod = require("./utils/chooseDefaultSeedMethod");

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

    console.log(chalk.green`Seeder Examples: https://rawgit.com/Marak/faker.js/master/examples/browser/index.html`);

    addArrayField((values) => {
      const tablesSelected = values.table;
      const columns = flatten(tablesSelected.map((table) => schema[table]));
      const columnsSeedable = columns
        .filter((c) => c.columnKey !== "PRI")
        .filter((c) => c.columnKey !== "MUL");
      const seedFunctions = getFakerMethods();
      columnsSeedable.forEach((column) => {
        const defaultValue = chooseDefaultSeedMethod(column);
        addField(() => {
          return {
            type: "search-list",
            name: "crudType",
            message: `Choose seed generator for column: ${column.table}.${column.column}`,
            choices: seedFunctions.map(
              (s) => `${s.path}, e.g: ${s.sampleOutput}`
            ),
            default: defaultValue
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

        console.log(chalk.green`Succesfully created \n${targetFilePath}`);
        return true;
      },
    },
  ],
};
