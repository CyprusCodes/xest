const chalk = require("chalk");
const { execSync } = require("child_process");
const path = require("path");
const runSqlQueryWithinContainer = require("./runSqlQueryWithinContainer");
const resolvePortConflict = require("./resolvePortConflict");
const sleep = require("./sleep");

const runMySQLContainer = async (rootPath, projectName) => {
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
      return false;
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
    ({ error, output } = await runSqlQueryWithinContainer(checkDatabaseSchema));

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
    return false;
  }

  return mySQLContainerId;
};

module.exports = runMySQLContainer;
