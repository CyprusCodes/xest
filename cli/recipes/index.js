// register recipes for use here
const endpointRecipe = require("./endpoint");
const queryRecipe = require("./query");
const migrationRecipe = require("./migration");
const seedRecipe = require("./seed");

module.exports = [endpointRecipe, migrationRecipe, seedRecipe, queryRecipe];
