const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const isEmpty = require("lodash/isEmpty");
const findProjectRoot = require("./findProjectRoot");

let schemaData;

const getSchema = () => {
  if (schemaData) {
    // return cached version
    return schemaData;
  }

  const projectDetails = findProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`No schema metadata was found. Autosuggestion wont work for table/column names.`
    );
    return false;
  }

  const { filename } = projectDetails;
  const rootPath = path.dirname(filename);
  try {
    console.log(`${rootPath}/.xest/schema.json`);
    const schema = fs.readFileSync(`${rootPath}/.xest/schema.json`, "utf-8");
    schemaData = JSON.parse(schema);
  } catch (err) {
    console.log(err);
    console.log(
      chalk.red`Corrupted schema file.  Autosuggestion wont work for table/column names.`
    );
    return false;
  }

  return schemaData;
};

const getPrimaryKey = (tableName) => {
  const schema = getSchema();
  if (!schema) {
    return null;
  }

  const table = schema[tableName];
  return table.find(column => column.columnKey === "PRI");
}

const getForeignKeys = (tableName) => {
  const schema = getSchema();
  if (!schema) {
    return [];
  }

  const table = schema[tableName];
  return table.filter(column => !isEmpty(column.foreignKeyTo));
}

module.exports = { getSchema, getPrimaryKey, getForeignKeys };
