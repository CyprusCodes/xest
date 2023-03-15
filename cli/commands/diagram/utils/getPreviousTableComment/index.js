const get = require("lodash/get");

const getPreviousTableComment = (tableName, previousDiagramJSON) => {
    const tables = get(previousDiagramJSON, "sources.0.tables", []);
    const table = tables.find(table => table.table === tableName);
    if (table) {
        return table.comment;
    }
    return false;
}

module.exports = getPreviousTableComment;