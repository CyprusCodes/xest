const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const startCase = require("lodash/startCase");
const camelCase = require("lodash/camelCase");
const replace = require("replace-in-file");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
const TableSelector = require("../../components/TableSelector");
const ColumnSelector = require("../../components/ColumnSelector");
const { writeFile } = require("../../utils/createFile");
const getSchema = require("../../utils/getSchema");
const chalk = require("chalk");

module.exports = {
  name: "query", // MUST match directory name
  userPrompt: async (projectRootPath) => {
    const schema = await getSchema();
    if (!schema) {
      return;
    }
    console.log(schema, "schema");

    const response = await inquirer.prompt([
      {
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
      },
      {
        type: "list",
        name: "crudType",
        message: "What type of operation will this query perform?",
        choices: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      },
      TableSelector(schema),
    ]);

    const tableName = response.table;
    const defaultColumns = schema[tableName].map((c) => c.column);
    const response2 = await inquirer.prompt([
      { ...ColumnSelector(schema, tableName), default: defaultColumns },
      {
        type: "input",
        name: "entityName",
        validate: (input) => Boolean(input.trim()),
        message: "What is the name of entity queried? e.g: UserDetails",
      },
    ]);
    return { ...response, response2 };
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
        sourceFileParentDirectory,
      }) => {
        const { crudType } = userVariables;
        sourceFilePath = sourceFilePath.replace(
          "insert.js",
          `${crudType.toLowerCase()}.js`
        );

        await writeFile(
          targetFilePath,
          fs.readFileSync(sourceFilePath, "utf-8")
        );
        const results = await replace({
          files: targetFilePath,
          from: /{{([^\s]+)}}/g,
          to: (match) => {
            const variableName = match.replace(/}/g, "").replace(/{/g, "");
            if (!userVariables[variableName]) {
              console.log(
                chalk.red`Unknown template variable ${variableName} sourceFile: ${sourceFilePath}`
              );
              return "";
            }

            return userVariables[variableName];
          },
        });

        console.log(chalk.green`Succesfully created \n${targetFilePath}`);
        return true;
      },
    },
  ],
};
