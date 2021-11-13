const fs = require("fs");
const path = require("path");
const startCase = require("lodash/startCase");
const camelCase = require("lodash/camelCase");
const replace = require("replace-in-file");
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

module.exports = {
  name: "query", // MUST match directory name
  userPrompt: async (projectRootPath) => {
    const schema = getSchema();
    if (!schema) {
      return;
    }

    const { addField, addArrayField, getAnswers } = useForm();
    /*
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
    */

    const { add } = addArrayField((values) => {
      return TableSelector({
        schema,
        onReply: (tableNameSelect) => {
          const foreignKeys = getForeignKeys(tableNameSelect);
          if (foreignKeys.length) {
            add(); // ask the same question again...
          }
        },
      });
    });

    addField((values) => {
      const tableName = values.table;
      console.log(values)
      const defaultColumns = schema[tableName].map((c) => c.column);
      return {
        ...ColumnSelector({ schema, tableName }),
        default: defaultColumns,
      };
    });

    addField((values) => {
      return {
        type: "input",
        name: "entityName",
        validate: (input) => Boolean(input.trim()),
        message: "What is the name of entity queried? e.g: UserDetails",
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
        const { crudType, entityName, table } = userVariables;
        sourceFilePath = sourceFilePath.replace(
          "insert.js",
          `${crudType.toLowerCase()}.liquid`
        );
        const templateFile = fs.readFileSync(sourceFilePath, "utf-8");
        const renderedTemplate = await render(templateFile, {
          entityName,
          primaryField: getPrimaryKey(table).column,
          tableName: table,
        });
        await writeFile(targetFilePath, renderedTemplate);

        console.log(chalk.green`Succesfully created \n${targetFilePath}`);
        return true;
      },
    },
  ],
};
