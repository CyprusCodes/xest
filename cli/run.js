const chalk = require("chalk");
const snakeCase = require("lodash/snakeCase");
const { execSync } = require("child_process");
const { dirname } = require("path");
const findJustRestProjectRoot = require("./utils/findProjectRoot");
const path = require("path");
const fs = require("fs");
const runSQL = require("./utils/runSQLDockerContainer");
const resolvePortConflict = require("./utils/resolvePortConflict");
const sleep = require("./utils/sleep");

const run = async () => {
  const projectDetails = findJustRestProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a justREST project directory. Please check your current path directory.`
    );
    return;
  }

  const {
    value: { name: projectName }
  } = projectDetails;

  const { filename } = projectDetails;
  const rootPath = dirname(filename);

  // check if docker daemon is running
  try {
    const isDockerDaemonRunning = execSync(`docker ps`, {
      cwd: path.join(rootPath, "database")
    }).toString();
  } catch (err) {
    if (err.toString().includes("Error")) {
      console.log(
        chalk.red`Docker is currently not running. Please start Docker and repeat ${chalk.green`just run`} again.`
      );
      return;
    }
  }

  const isDockerMySQLContainerRunning = execSync(
    `docker ps --format "table {{.ID}}\t{{.Names}}" | grep ${projectName}-mysql-db | cut -d ' ' -f 1`,
    {
      cwd: path.join(rootPath, "database")
    }
  ).toString();

  let ready = false;
  let retryCount = 1;
  let error;
  let output;

  let mySQLContainerId = isDockerMySQLContainerRunning.trim();
  if (!Boolean(isDockerMySQLContainerRunning)) {
    // check if mysql port is available for use
    await resolvePortConflict(3306, "MySQL Docker Container");

    const runMySQLContainer = execSync(`docker-compose up -d`, {
      cwd: path.join(rootPath, "database")
    }).toString();
  }

  const isDockerMySQLContainerRunningAgain = execSync(
    `docker ps --format "table {{.ID}}\t{{.Names}}" | grep ${projectName}-mysql-db | cut -d ' ' -f 1`,
    {
      cwd: path.join(rootPath, "database")
    }
  ).toString();
  mySQLContainerId = isDockerMySQLContainerRunningAgain.trim();

  // check whether mysql is ready
  console.log(
    chalk.yellow`Waiting for MySQL Container to become ready. This should only take a few seconds.`
  );
  while (!ready && retryCount < 10) {
    const mySQLConnectionString = `mysql -h localhost -u root -ppassword -e 'status'`;
    const checkDatabaseSchema = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString}`;
    ({ error, output } = await runSQL(checkDatabaseSchema));

    if (!error) {
      const uptimeStatus = output
        .split("\n")
        .find(row => row.includes("Uptime"))
        .replace(/\s/g, "")
        .split(":")[1];
      const uptimeRegex = /(\d*)sec$/;
      const [_, secs] = uptimeStatus.match(uptimeRegex);
      if (Number(secs) > 10 || uptimeStatus.includes("min")) {
        ready = true;
      }
    }
    retryCount++;
    if (!ready) {
      await sleep(1000 * retryCount);
    }
  }
  if (!ready) {
    console.log(
      chalk.red`MySQL instance is not ready yet. Try running ${chalk.green`just run`} again.`
    );
  }

  const checkDatabaseSchemaAppliedQuery = `select count(*) as count from migrations where name = '/20211107064304-database-schema';`;
  const mySQLConnectionString = `mysql -h localhost -u root -ppassword ${snakeCase(
    projectName
  )}_db`;
  const checkDatabaseSchema = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${checkDatabaseSchemaAppliedQuery}"`;
  // insert database schema
  ({ error, output } = await runSQL(checkDatabaseSchema));
  if (error && error.includes("ERROR 1146")) {
    console.log(chalk.yellow`Setting up your database schema.`);
    const runDbSchemaQuery = `cat ${rootPath}/database/database-schema.sql | docker exec -i ${mySQLContainerId} ${mySQLConnectionString}`;
    ({ error, output } = await runSQL(runDbSchemaQuery));
  }

  // run migrations
  // check whether the last migration has been run
  const files = fs.readdirSync(path.join(rootPath, "migrations"));
  const [latestMigrationFile] = files
    .filter(file => file.endsWith(".js"))
    .sort(function(a, b) {
      var aIsDir = fs.statSync(rootPath + "/migrations/" + a).isDirectory(),
        bIsDir = fs.statSync(rootPath + "/migrations/" + b).isDirectory();

      if (aIsDir && !bIsDir) {
        return 1;
      }

      if (!aIsDir && bIsDir) {
        return -1;
      }

      return b.localeCompare(a);
    });
  const checkMigrationsQuery = `select count(*) as count from migrations where name='/${latestMigrationFile.replace(
    ".js",
    ""
  )}';`;
  const checkMigrations = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${checkMigrationsQuery}"`;
  ({ error, output } = await runSQL(checkMigrations));
  if (!error && output.includes("count\n0\n")) {
    console.log(chalk.yellow`Applying database migrations.`);
    execSync("npm run migrate-up:all", {
      // -- -v flag for verbose
      cwd: rootPath,
      stdio: "inherit"
    });
  }

  // insert seed data
  // seed data is inserted after migrations, so seed is always kept up to date
  const checkSeedDataQuery = `select count(*) as count from migrations where name = '/20211107064324-seed-data';`;
  const checkSeedData = `docker exec -i ${mySQLContainerId} ${mySQLConnectionString} <<< "${checkSeedDataQuery}"`;
  ({ error, output } = await runSQL(checkSeedData));
  if (!error && output.includes("count\n0\n")) {
    console.log(chalk.yellow`Populating database with seed data.`);
    const populateSeedData = `cat ${rootPath}/database/seed-data.sql | docker exec -i ${mySQLContainerId} ${mySQLConnectionString}`;
    ({ error, output } = await runSQL(populateSeedData));
    if (error && error.includes("ERROR")) {
      console.log(
        chalk.red`Failed to populate database with seed data. This might happen if you have recently updated your migrations, please modify your seed data to match new schema changes.`
      );
    }
  }

  await resolvePortConflict(3001, `${projectName} API`);
  console.log(chalk.yellow`Starting ${projectName} API project`);
  execSync("npm run dev", {
    cwd: rootPath,
    stdio: "inherit"
  });
};

module.exports = {
  run
};
