// register recipes for use here
const queryRecipe = require("./query");
const migrationRecipe = require("./migration");
const seedRecipe = require("./seed");
const endpointRecipe = require("./endpoint");

module.exports = [queryRecipe, migrationRecipe, seedRecipe, endpointRecipe];
