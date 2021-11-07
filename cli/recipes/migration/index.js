const inquirer = require("inquirer");
const kebabCase = require("lodash/kebabCase");
const { execSync } = require("child_process");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
const chalk = require("chalk");

module.exports = {
  name: "migration", // MUST match directory name
  userPrompt: () => {
    const lastElement = process.argv[process.argv.length - 1];
    let migrationName = null;

    if (lastElement !== "migration") {
      migrationName = lastElement;
    }

    if (!migrationName) {
      return inquirer
        .prompt({
          type: "input",
          name: "migrationName",
          validate: input => Boolean(input.trim()),
          message:
            "What is changing with this migration? E.g: drop-payment-id-field"
        })
        .then(response => {
          return { migrationName: kebabCase(response.migrationName) };
        });
    }
    return Promise.resolve({ migrationName: kebabCase(migrationName) });
  },
  files: [
    {
      source: "queries/insert.js",
      targetFileNameMapper: ({ projectRootPath, userVariables }) => {
        const { migrationName } = userVariables;

        execSync(`npm run migrate:new ${migrationName}`, {
          cwd: projectRootPath,
          stdio: "inherit"
        });

        // return null so transformation is skipped;
        return null;
      },
      targetFileWriter: async () => {}
    }
  ]
};
