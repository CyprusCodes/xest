const fs = require("fs");
const chalk = require("chalk");
const { execSync } = require("child_process");
const path = require("path");
const snakeCase = require("lodash/snakeCase");
const runSqlQueryWithinContainer = require("./runSqlQueryWithinContainer");
const resolvePortConflict = require("./resolvePortConflict");
const isAppleSilicon = require("./isAppleSilicon");
const execa = require("execa");
const sleep = require("./sleep");

const runMySQLContainer = async (rootPath, projectName) => {
  // check if docker daemon is running
  try {
    await execa("docker", ["ps"]);
  } catch (err) {
    if (err.toString().includes("Error")) {
      console.log(
        chalk.red`Docker is currently not running. Please start Docker and repeat ${chalk.green`xx run`} again.`,
      );
      return false;
    }
  }

  const isDockerMySQLContainerRunning = execSync(
    `docker ps --format "table {{.ID}}\t{{.Names}}" | grep ${projectName}-mysql-db | cut -d ' ' -f 1`,
    {
      cwd: path.join(rootPath, "database"),
    },
  ).toString();

  let ready = false;
  let retryCount = 1;
  let error;
  let output;

  // read from docker-compose file the PORT number
  const usingAppleSiliconChipset = isAppleSilicon();
  const composeFileName = usingAppleSiliconChipset
    ? "docker-compose.apple-silicon.yml"
    : "docker-compose.yml";
  const dockerComposeFilePath = path.join(
    rootPath,
    "database",
    composeFileName,
  );

  const dockerComposeFile = fs.readFileSync(dockerComposeFilePath, "utf8");

  // Define the service name
  const serviceName = `${projectName}-db`;

  // Regex pattern to extract the host port
  const pattern = new RegExp(
    `${serviceName}:\\s*\\n(?:\\s*\\w+:.*\\n)*\\s*ports:\\s*\\n(?:\\s*-\\s*"?(\\d+):\\d+"?\\n)*`,
    "gm",
  );
  const match = pattern.exec(dockerComposeFile);
  let mysqlHostPort = 3306;

  if (match && match[1]) {
    mysqlHostPort = Number(match[1]);
  }

  let mySQLContainerId = isDockerMySQLContainerRunning.trim();
  if (!Boolean(isDockerMySQLContainerRunning)) {
    // check if mysql port is available for use
    await resolvePortConflict(mysqlHostPort, "MySQL Docker Container", false);

    // Since Docker Compose V2, docker compose is preferred over docker-compose
    let dockerComposePrefixByVersion = "docker compose";
    try {
      execSync("docker compose version");
    } catch (err) {
      // Fallback to legacy docker-compose command if docker compose fails
      dockerComposePrefixByVersion = "docker-compose";
    }
    let dockerComposeCommand = `${dockerComposePrefixByVersion} --project-name ${projectName} -f ${composeFileName} up -d`;

    const runMySQLContainer = execSync(dockerComposeCommand, {
      cwd: path.join(rootPath, "database"),
    }).toString();
  }

  const isDockerMySQLContainerRunningAgain = execSync(
    `docker ps --format "table {{.ID}}\t{{.Names}}" | grep ${projectName}-mysql-db | cut -d ' ' -f 1`,
    {
      cwd: path.join(rootPath, "database"),
    },
  ).toString();
  mySQLContainerId = isDockerMySQLContainerRunningAgain.trim();

  // check whether mysql is ready
  console.log(
    chalk.yellow`Waiting for MySQL Container to become ready. This should only take a few seconds.`,
  );

  while (!ready && retryCount < 60) {
    const query = `SELECT COUNT(*) as tbl_count FROM information_schema.tables WHERE table_schema = '${snakeCase(
      projectName,
    )}_db';`;
    const mySQLConnectionString = `mysql -h localhost -u root -ppassword ${snakeCase(
      projectName,
    )}_db`;
    const checkDatabaseSchema = `printf "${query}" | docker exec -i ${mySQLContainerId} ${mySQLConnectionString}`;
    ({ error, output } = await runSqlQueryWithinContainer(checkDatabaseSchema));

    if (!error) {
      const tableCount = output.replace(/\s/g, "").replace(/\D/g, "");
      if (Number(tableCount) > 0 || Number(tableCount) === 0) {
        ready = true;
      }
    }
    retryCount++;
    if (!ready) {
      await sleep(300);
    }
  }
  if (!ready) {
    console.log(
      chalk.red`MySQL instance is not ready yet. Try running ${chalk.green`xx run`} again.`,
    );
    return false;
  }

  return mySQLContainerId;
};

module.exports = runMySQLContainer;
