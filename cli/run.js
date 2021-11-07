const inquirer = require("inquirer");
const chalk = require("chalk");
const snakeCase = require("lodash/snakeCase");
const { exec, execSync } = require("child_process");
const { dirname } = require("path");
const findJustRestProjectRoot = require("./utils/findProjectRoot");
const path = require("path");
const runSQL = require("./utils/runSQLDockerContainer");

const run = async (appName) => {
  const projectDetails = findJustRestProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a justREST project directory. Please check your current path directory.`
    );
    return;
  }

  const {
    value: { name: projectName },
  } = projectDetails;

  const { filename } = projectDetails;
  const rootPath = dirname(filename);
  console.log(rootPath);

  const isDockerMySQLContainerRunning = execSync(
    `docker ps --format "table {{.ID}}\t{{.Names}}" | grep ${projectName}-mysql-db | cut -d ' ' -f 1`,
    {
      cwd: path.join(rootPath, "infrastructure"),
    }
  ).toString();
  let mySQLContainerId = isDockerMySQLContainerRunning.trim();
  if (!Boolean(isDockerMySQLContainerRunning)) {
    const runMySQLContainer = execSync(`docker-compose up -d`, {
      cwd: path.join(rootPath, "infrastructure"),
    }).toString();
    mySQLContainerId = runMySQLContainer.trim();
  }
  const checkDatabaseSchemaAppliedQuery = `select count(*) as count from migrations where name = 'database-schema';`;
  const mySQLConnectionString = `mysql -h localhost -u root -ppassword ${snakeCase(
    projectName
  )}_db`;

  const checkDatabaseSchema = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${checkDatabaseSchemaAppliedQuery}"`;
  // insert database schema
  let { error, output } = await runSQL(checkDatabaseSchema);
  if (error && error.includes("ERROR 1146")) {
    console.log(chalk.yellow`Setting up your database schema.`);
    const runDbSchemaQuery = `cat ${rootPath}/infrastructure/database-schema.sql | docker exec -i ${mySQLContainerId} ${mySQLConnectionString}`;
    ({ error, output } = await runSQL(runDbSchemaQuery));
  }

  // insert seed data
  const checkSeedDataQuery = `select count(*) as count from migrations where name = 'seed-data';`;
  const checkSeedData = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${checkSeedDataQuery}"`;;
  ({ error, output } = await runSQL(checkSeedData));
  if (!error && output.includes("count\n0\n")) {
    console.log(chalk.yellow`Populating database with seed data.`);
    const populateSeedData = `cat ${rootPath}/infrastructure/seed-data.sql | docker exec -i ${mySQLContainerId} ${mySQLConnectionString}`;
    ({ error, output } = await runSQL(populateSeedData));
  }
 

  //console.log()
  /*  
    PG_CONTAINER_ID=$(docker ps -a --format "table {{.ID}}\t{{.Names}}" | grep pg-instance | cut -d ' ' -f 1)

  for file in db/migrate/*.up.sql ; do
      cat $file | docker exec -i $PG_CONTAINER_ID psql -U user -d local
  done
    @echo "Importing data from infrastructure/database-up.sql"
    @cd infrastructure; docker exec -i my-api-mysql-db mysql -uroot -ppassword mysql < database-up.sql
    @npm run migrate-up:all
    @cd infrastructure; docker exec -i my-api-mysql-db mysql -uroot -ppassword mysql < db-seed.sql
  */

  // run docker instance if it's not running
  // run db-migrations if necessary
  // npm run dev
};

module.exports = {
  run,
};
