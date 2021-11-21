const AsciiTable = require("ascii-table");

const generateTable = ({
  title = "Table Title",
  columnHeaders = ["A", "B", "C"],
  rows = [["", "", ""]]
}) => {
  const table = new AsciiTable(title);
  table.setHeading(...columnHeaders);
  rows.forEach(r => {
    table.addRow(...r);
  });
  return table.toString();
};

module.exports = generateTable;
