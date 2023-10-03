function decodeCursorValues(encodedCursor) {
  const decodedData = Buffer.from(encodedCursor, "base64").toString("utf8");
  return JSON.parse(decodedData);
}

module.exports = decodeCursorValues;
