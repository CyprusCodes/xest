const openai = require("../utils/openai");
const { getSchema } = require("../../../utils/getSchema");

let GET_LIST_OF_DATABASE_TABLES;
let GET_DATABASE_TABLE_SCHEMA;

GET_LIST_OF_DATABASE_TABLES = {
  name: "getListOfDatabaseTables",
  description:
    "returns the full list of all tables in the MySQL database for the project",
  associatedCommands: [
    {
      command: GET_DATABASE_TABLE_SCHEMA,
      description:
        "you can use the output of table names, and read the schema for each table",
    },
  ],
  prerequisites: [],
  parameterize: async () => {
    return ``;
  },
  parameters: { type: "object", properties: {}, required: [] },
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async function () {
    const schema = await getSchema();
    return Object.keys(schema).join(",");
  },
};

GET_DATABASE_TABLE_SCHEMA = {
  name: "getTableSchema",
  description: "returns the table schema",
  associatedCommands: [],
  prerequisites: [
    {
      command: GET_LIST_OF_DATABASE_TABLES,
      description: `each table can be investigate further with getTableSchema command`,
    },
  ],
  parameterize: async function ({ arguments, messages, callHistory }) {
    try {
      const argsJson = JSON.parse(arguments);
      const tableName = argsJson.tableName;
      const schema = await getSchema();
      if (!schema[tableName]) {
        throw new Error("Table doesn't exist");
      }
      return tableName;
    } catch (error) {
      console.log(error);
      throw new Error(`There is no such table in the database. Double check your arguments.`);
    }
  },
  parameters: {
    type: "object",
    properties: {
      tableName: {
        type: "string",
        description: "name of the database table",
      },
    },
    required: ["tableName"],
  },
  rerun: false,
  rerunWithDifferentParameters: true,
  runCmd: async (tableName) => {
    const schema = await getSchema();
    const table = schema[tableName];
    return JSON.stringify(table);
  },
};

module.exports = [GET_LIST_OF_DATABASE_TABLES, GET_DATABASE_TABLE_SCHEMA];
