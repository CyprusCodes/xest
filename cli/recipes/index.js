// register recipes for use here
const queryRecipe = require("./query");
const migrationRecipe = require("./migration");
const seedRecipe = require("./seed");

module.exports = [queryRecipe, migrationRecipe, seedRecipe];
