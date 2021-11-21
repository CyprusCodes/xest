const fs = require("fs");
const { execSync } = require("child_process");
const snakeCase = require("lodash/snakeCase");
const { writeFile } = require("../../../utils/createFile");
const get = require("lodash/get");
const { mapValues } = require("lodash");

const updateDatabaseMetadata = async ({
  mySQLContainerId,
  rootPath,
  projectName,
}) => {
  let foreignKeySummaryOutput;
  let databaseSchemaOutput;
  const dbName = `${snakeCase(projectName)}_db`;
  const mySQLConnectionString = `mysql -h localhost -u root -ppassword ${dbName}`;
  try {
    const getForeignKeys = `
    SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
    FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
        REFERENCED_TABLE_SCHEMA = '${dbName}';`;

    const getForeignKeysQuery = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${getForeignKeys}"`;
    out = await execSync(getForeignKeysQuery, {
      cwd: rootPath,
    }).toString();
    const rows = out
      .replace(/\t/g, " ")
      .split("\n")
      .map((row) => {
        const cells = row.split(" ");
        return {
          sourceTable: cells[0],
          sourceColumn: cells[1],
          targetTable: cells[2],
          targetColumn: cells[3],
        };
      });
    const foreignKeys = rows.reduce((acc, curr) => {
      if (curr.sourceTable === "" || curr.sourceTable === "TABLE_NAME") {
        return acc;
      }
      const key = `${curr.sourceTable}.${curr.sourceColumn}`;
      let table = acc[key];
      if (table) {
        table.push(curr);
      } else {
        acc[key] = [curr];
      }
      return acc;
    }, {});

    foreignKeySummaryOutput = foreignKeys;
  } catch (err) {
    console.log(`\n\n\nDEBUG START`);
    console.log(out);
    console.log(err);
    console.log(`DEBUG END`);
    console.log(
      chalk.red`Can not generate database metadata. Please report the above error at https://github.com/CyprusCodes/xest/issues`
    );
  }

  try {
    const getColumns = `
    SELECT 
        TABLE_NAME, 
        COLUMN_NAME, 
        IS_NULLABLE, 
        DATA_TYPE, 
        COLUMN_KEY, 
        COLUMN_TYPE, 
        EXTRA 
    FROM information_schema.columns 
    WHERE table_schema = '${dbName}';`;

    const getColumnsQuery = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${getColumns}"`;
    out = await execSync(getColumnsQuery, {
      cwd: rootPath,
    }).toString();
    const rows = out
      .replace(/\t/g, " ")
      .split("\n")
      .map((row) => {
        const cells = row.split(" ");
        return {
          table: cells[0],
          column: cells[1],
          nullable: cells[2] === "YES",
          dataType: cells[3],
          columnnType: cells[5],
          columnKey: cells[4],
          extra: cells[6],
        };
      });
    const tables = rows.reduce((acc, curr) => {
      let table = acc[curr.table];
      if (table) {
        table.push(curr);
      } else {
        acc[curr.table] = [curr];
      }
      return acc;
    }, {});
    delete tables[""];
    delete tables["TABLE_NAME"];
    databaseSchemaOutput = tables;
  } catch (err) {
    console.log(`\n\n\nDEBUG START`);
    console.log(out);
    console.log(err);
    console.log(`DEBUG END`);
    console.log(
      chalk.red`Can not generate database metadata. Please report the above error at https://github.com/CyprusCodes/xest/issues`
    );
  }
  
  if (databaseSchemaOutput && foreignKeySummaryOutput) {
    const listOfForeignKeys = Object.keys(foreignKeySummaryOutput);
    const finalOutput = mapValues(databaseSchemaOutput, (columns) => {
      return columns.map((column) => {
        const pathToCheck = `${column.table}.${column.column}`;
        const isForeignKey = listOfForeignKeys.includes(pathToCheck);

        if (isForeignKey) {
          const foreignKeyInformation = get(
            foreignKeySummaryOutput[pathToCheck],
            `[0]`,
            {}
          );
          return {
            ...column,
            foreignKeyTo: {
              targetTable: foreignKeyInformation.targetTable,
              targetColumn: foreignKeyInformation.targetColumn,
            },
          };
        }
        return column;
      });
    });
    writeFile(`${rootPath}/.just/schema.json`, JSON.stringify(finalOutput));
  }
};

module.exports = updateDatabaseMetadata;
