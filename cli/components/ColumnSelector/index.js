const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = (schema, tableName) => {
  return {
    type: "checkbox",
    message: "Select columns",
    name: "columns",
    choices: () => {
      return Object.entries(schema[tableName]).map(([table, column]) => {
        let label = `${chalk.bold`${column.column}`} ${column.columnnType} ${
          column.nullable ? "NULL" : "NOT NULL"
        } `;
        const isPrimaryKey = column.columnKey === "PRI";
        const isForeignKey = column.columnKey === "MUL";

        if (isPrimaryKey) {
          label = label + "PRIMARY";
        }

        if (isForeignKey) {
          label = label + "FOREIGN KEY";
        }

        return { name: label, value: column.column };
      });
    },
  };
};
