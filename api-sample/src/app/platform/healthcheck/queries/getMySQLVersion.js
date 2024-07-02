const { submitQuery, getFirst } = require("~root/lib/database");

const getMySQLVersion = () => submitQuery`
    SELECT VERSION() as version;
`;

module.exports = getFirst(getMySQLVersion, "version");
