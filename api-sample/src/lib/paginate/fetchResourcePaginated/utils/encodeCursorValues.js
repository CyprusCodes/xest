const camelCase = require("lodash/camelCase");

function encodeCursorValues(referenceRecord, orderBy) {
  const cursorObj = orderBy.map(o => {
    const column = o.column.split(".")[1];
    const value = referenceRecord[column]
      ? referenceRecord[column]
      : referenceRecord[camelCase(column)];
    return { column: o.column, value };
  });
  return Buffer.from(JSON.stringify(cursorObj)).toString("base64");
}

module.exports = encodeCursorValues;
