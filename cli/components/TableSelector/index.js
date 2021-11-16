const inquirer = require("inquirer");
const searchList = require("inquirer-search-list");
inquirer.registerPrompt("search-list", searchList);

const TableColumnSelector = ({ tables, ...rest }) => {
  return {
    type: "search-list",
    message: "Select a table",
    name: "table",
    choices: tables,
    ...rest,
  };
};

module.exports = TableColumnSelector;
