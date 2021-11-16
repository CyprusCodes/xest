const inquirer = require("inquirer");
const fs = require("fs");
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

module.exports = {
  name: "query", // MUST match directory name
  userPrompt: async (projectRootPath) => {
    const schema = getSchema();
    if (!schema) {
      return;
    }

    const { addField, addArrayField, getAnswers } = useForm();
    addField((values) => {
      return {
        root: projectRootPath,
        hideRoot: true,
        type: "file-tree-selection",
        name: "directory",
        validate: (path) => {
          const check =
            fs.statSync(path).isDirectory() &&
            !path.endsWith("node_modules") &&
            !path.endsWith("migrations") &&
            !path.endsWith(".just") &&
            !path.endsWith("queries");
          // it would be better to disable database folder as well
          // but there seems to be a problem with expanding the first element
          // with this component
          return check;
        },
        onlyShowValid: true,
        message: "Choose directory to create a new query file",
      };
    });

    addField((values) => {
      return {
        type: "list",
        name: "crudType",
        message: "What type of operation will this query perform?",
        choices: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      };
    });

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
          if (values.crudType !== "SELECT") {
            return;
          }
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
              `You will be querying ${chalk.green`${
                hasSelectedTables ? tablesSelected.join(",") : tableNameSelected
              }`}`
            );

            const result = await inquirer.prompt({
              type: "confirm",
              name: "addMore",
              message: chalk.yellow`Would you like to join onto another table?`,
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
      const crud = values.crudType;
      const tablesSelected = values.table;
      const columns = flatten(tablesSelected.map((table) => schema[table]));

      if (crud === "SELECT") {
        const defaultColumns = columns.map((c) => `${c.table}.${c.column}`);
        return ColumnSelector({ columns, default: defaultColumns });
      } else if (crud === "UPDATE") {
        const defaultColumns = columns
          .filter((c) => c.columnKey !== "PRI")
          .map((c) => `${c.table}.${c.column}`);
        return ColumnSelector({ columns, default: defaultColumns });
      } else if (crud === "INSERT") {
      }
    });

    addField((values) => {
      const crud = values.crudType;
      const tablesSelected = values.table;
      const columns = flatten(tablesSelected.map((table) => schema[table]));

      if (crud === "SELECT") {
        const defaultColumns = columns
          .filter((c) => c.columnKey === "PRI")
          .map((c) => `${c.table}.${c.column}`);
        return ColumnSelector({
          columns,
          default: [defaultColumns[0]],
          message: "Select columns to filter",
          name: "filterColumns",
        });
      }
    });

    addField((values) => {
      return {
        type: "input",
        name: "entityName",
        validate: (input) => Boolean(input.trim()),
        message: "What is the name of entity queried? Default:",
        default: values.table[0],
      };
    });

    const responses = await getAnswers();
    return responses;
  },
  files: [
    {
      source: "queries/insert.js",
      targetFileNameMapper: ({ userVariables, sourceFileRelative }) => {
        const {
          directory: targetDirectory,
          entityName,
          crudType,
        } = userVariables;
        const targetFiletName = sourceFileRelative
          .replace("insert", crudType.toLowerCase())
          .replace(
            ".js",
            `${startCase(camelCase(entityName)).replace(/ /g, "")}.js`
          );
        const targetPath = path.join(targetDirectory, targetFiletName);
        return targetPath;
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

        sourceFilePath = sourceFilePath.replace(
          "insert.js",
          `${crudType.toLowerCase()}.liquid`
        );
        const templateFile = fs.readFileSync(sourceFilePath, "utf-8");
        let renderedTemplate;

        if (crudType === "SELECT") {
          renderedTemplate = await render(templateFile, {
            entityName,
            primaryField: getPrimaryKey(table[0]).column,
            tableName: table[0],
            tablesToJoin: table,
            filterFields: filterColumns,
            selectFields: columns,
            schema,
          });
        } else if (crudType === "INSERT") {
          const tableName = table[0];
          const fields = schema[table].filter((c) => c.columnKey !== "PRI");

          const tableFields = fields.map((c) => c.column);
          const insertParameters = tableFields.map((c) => camelCase(c));

          renderedTemplate = await render(templateFile, {
            entityName,
            tableName,
            insertParameters,
            tableFields,
          });
        } else if (crudType === "UPDATE") {
          const tableName = table[0];
          const primaryField = getPrimaryKey(table[0]).column;

          renderedTemplate = await render(templateFile, {
            entityName,
            tableName,
            filterFields: columns,
            primaryField,
            filterFieldsWithPrimary: [
              `${tableName}.${primaryField}`,
              ...columns,
            ],
          });
        } else {
          renderedTemplate = await render(templateFile, {
            entityName,
            primaryField: getPrimaryKey(table[0]).column,
            tableName: table[0],
          });
        }

        await writeFile(targetFilePath, renderedTemplate);
        await prettifyFile(targetFilePath);

        console.log(chalk.green`Succesfully created \n${targetFilePath}`);
        return true;
      },
    },
  ],
};
