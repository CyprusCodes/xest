const openai = require("../utils/openai");
const fs = require("fs");
const { getSchema } = require("../../../utils/getSchema");

let GET_LIST_OF_DATABASE_TABLES;
let GET_DATABASE_TABLE_SCHEMA;

const tryExtractTableName = async ({
  prompt,
  parameters,
  commandName,
  tableNames,
}) => {
  const parametizationPrompt = `${commandName} command takes parameters named below

  ${parameters.map(
    (param) =>
      `${param.name} ${param.type} ${
        param.required ? "required" : "optional"
      }: ${param.description}`
  )}
  
  convert below sentence into a list of comma seperated arguments in the format ${commandName}(${parameters
    .map((p) => p.name)
    .join(",")})

  pay attention to types of arguments, enclose strings in double quotes

  sentence: ${prompt}
  output:`;

  const response = await openai.createCompletion({
    model: "text-curie-001",
    prompt: parametizationPrompt,
    temperature: 0,
    max_tokens: 256,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    best_of: 1,
  });

  console.log({parametizationPrompt})
  const sentence = response.data.choices[0].text || "";
  const regex = /\((.*?)\)/;
  const match = sentence.match(regex);
  const arg1 = match ? match[1].replace(/['"]+/g, '') : null;

  
  console.log({arg1, sentence})
  if (!tableNames.includes(arg1)) {
    return false;
  } else {
    return arg1;
  }
};

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
  parameterize: () => {
    return ``;
  },
  parameters: [],
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
  parameterize: async function ({ answer, messages, callHistory }) {
    const schema = await getSchema();
    const tableNames = Object.keys(schema);
    let step = 0;

    const tableName = await tryExtractTableName({
      prompt: answer,
      tableNames,
      commandName: this.name,
      parameters: this.parameters,
    });

    let paramFound = Boolean(tableName);
    while (!paramFound && step < 2) {
      const newMessages = [...messages];
      newMessages.push({
        role: "system",
        content:
          "You need to pick a table from getListOfDatabaseTables command output to investigate getTableSchema.",
      });

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: newMessages,
        max_tokens: 100,
        temperature: 0,
      });

      const newAnswer = completion.data.choices[0].message.content;
      console.log(newAnswer, "????")
      const tableName = await tryExtractTableName({
        prompt: newAnswer,
        tableNames,
        commandName: this.name,
        parameters: this.parameters,
      });
      console.log(tableName)

      if (Boolean(tableName)) {
        return tableName;
      } else {
        throw new Error("failed to find table name");
      }
    }

    throw new Error("failed to find table name");
  },
  parameters: [
    {
      name: "tableName",
      required: true,
      description: "name of the database table",
      type: "string",
    },
  ],
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async (tableName) => {
    const schema = await getSchema();
    const table = schema[tableName];
    console.log(table);
    return JSON.stringify(table);
  },
};

module.exports = [GET_LIST_OF_DATABASE_TABLES, GET_DATABASE_TABLE_SCHEMA];
