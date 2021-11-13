const inquirer = require("inquirer");
const searchList = require("inquirer-search-list");
inquirer.registerPrompt("search-list", searchList);

const TableColumnSelector = ({ schema, ...rest }) => {
  return {
    type: "search-list",
    message: "Select a table",
    name: "table",
    choices: Object.keys(schema).map((table) => ({
      name: table,
      value: table,
    })),
    ...rest
  };
};

module.exports = TableColumnSelector;
