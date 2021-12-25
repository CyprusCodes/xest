const snakeCase = require("lodash/snakeCase");
const chalk = require("chalk");
const findProjectRoot = require("../utils/findProjectRoot");
const runMySQLContainer = require("../utils/runMySQLContainer");
const { dirname } = require("path");
const runSqlQueryWithinContainer = require("../utils/runSqlQueryWithinContainer");
const { run } = require("./run");

const fresh = async () => {
  const projectDetails = findProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a Xest project directory. Please check your current path directory.`
    );
    return;
  }

  const {
    value: { name: projectName }
  } = projectDetails;

  const { filename } = projectDetails;
  const rootPath = dirname(filename);

  // make sure mysql container is up and running
  const mySQLContainerId = await runMySQLContainer(rootPath, projectName);
  if (!mySQLContainerId) {
    return;
  }

  let error;
  let output;
  console.log(chalk.yellow`Dropping database ${snakeCase(projectName)}_db`);
  const dropDatabaseQuery = `drop database ${snakeCase(projectName)}_db`;
  const mySQLConnectionString = `mysql -h localhost -u root -ppassword ${snakeCase(
    projectName
  )}_db`;
  const dropDatabaseCmd = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${dropDatabaseQuery}"`;
  ({ error, output } = await runSqlQueryWithinContainer(dropDatabaseCmd));
  if (error) {
    console.log(
      chalk.red`Error: dropping database ${snakeCase(projectName)}_db`
    );
  }

  console.log(chalk.yellow`Creating database ${snakeCase(projectName)}_db`);
  const createDatabaseQuery = `create database ${snakeCase(projectName)}_db`;
  const mySQLConnectionString2 = `mysql -h localhost -u root -ppassword`;
  const createDatabaseCmd = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString2} <<< "${createDatabaseQuery}"`;
  ({ error, output } = await runSqlQueryWithinContainer(createDatabaseCmd));
  if (error) {
    console.log(error);
    console.log(
      chalk.red`Error: creating database ${snakeCase(projectName)}_db`
    );
  }

  await run();
};

module.exports = {
  fresh
};
