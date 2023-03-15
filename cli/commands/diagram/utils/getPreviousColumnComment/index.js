const get = require("lodash/get");

const getPreviousColumnComment = (
  tableName,
  columnName,
  previousDiagramJSON
) => {
  const tables = get(previousDiagramJSON, "sources.0.tables", []);
  const table = tables.find((table) => table.table === tableName);
  if (table) {
    const columns = table.columns;
    const column = columns.find((c) => c.name === columnName);
    if (column) {
      return column.comment;
    }
  }
  return false;
};

module.exports = getPreviousColumnComment;
