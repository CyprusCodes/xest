const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = ({ columns, ...rest }) => {
  return {
    type: "checkbox",
    message: "Select columns",
    name: "columns",
    choices: () => {
      const isSingleTable = columns.every((c) => c.table === columns[0].table);
      return columns.map((column) => {
        let label = `${
          isSingleTable ? "" : `${column.table}.`
        }${chalk.bold`${column.column}`} ${column.columnnType} ${
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

        return { name: label, value: `${column.table}.${column.column}` };
      });
    },
    ...rest,
  };
};
