const {
    camelCase,
    startCase,
} = require("lodash");

const toPascalCase = str => startCase(camelCase(str)).replace(/ /g, "")

module.exports = toPascalCase;