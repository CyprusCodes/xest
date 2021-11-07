const inquirer = require("inquirer");
const snakeCase = require("lodash/snakeCase");
const kebabCase = require("lodash/kebabCase");
const chalk = require("chalk");
const findJustRestProjectRoot = require("./utils/findProjectRoot");
const { writeFile, writeDirectory } = require("./utils/createFile");
const asyncSeries = require("./utils/asyncSeries");
const fs = require("fs");
const path = require("path");
const { fdir } = require("fdir");
const replace = require("replace-in-file");
const { execSync } = require("child_process");

const generate = (program) => async (appName) => {
  const projectRoot = findJustRestProjectRoot();
  if (projectRoot) {
    console.log(
      chalk.red`You are already in a justrest project directory. No need to scaffold a new API. Exiting.`
    );

    program.outputHelp();
    return;
  }

  if (!appName) {
    console.log("Please provide a project name"); // todo: get project name with inquirer
    return;
  }

  const appNameSnakeCase = snakeCase(appName);
  const appNameKebapCase = kebabCase(appName);
  const sampleProjectRootDirectory = path.join(
    __filename,
    "../../",
    "justrest-api-sample/"
  );
  const projectDirectoryToCreate = path.join(process.cwd(), appNameKebapCase);

  if (!fs.existsSync(projectDirectoryToCreate)) {
    fs.mkdirSync(projectDirectoryToCreate, { recursive: true });
  }

  const sourceProjectFiles = new fdir()
    .withBasePath()
    .withDirs()
    .filter((path) => {
      return !path.includes("node_modules");
    })
    .crawl(sampleProjectRootDirectory)
    .sync();

  const filesWritten = [];
  await asyncSeries(sourceProjectFiles, async (sourceFilePath) => {
    const isFile = fs.lstatSync(sourceFilePath).isFile();
    const isDirectory = fs.lstatSync(sourceFilePath).isDirectory();
    const target = sourceFilePath.replace(
      sampleProjectRootDirectory,
      `${projectDirectoryToCreate}/`
    );
    if (isFile) {
      const sourceFileContent = fs.readFileSync(sourceFilePath);
      await writeFile(target, sourceFileContent);
      filesWritten.push(target);
    }
    if (isDirectory) {
      await writeDirectory(target);
    }
  });

  console.log(chalk.green`${filesWritten.length} modules created.`);
  await replace({
    files: filesWritten,
    from: [/{{PROJECT_NAME_SNAKECASE}}/g, /{{PROJECT_NAME_KEBAPCASE}}/g],
    to: [appNameSnakeCase, appNameKebapCase],
  });

  console.log(chalk.green`Installing packages...`);
  execSync("npm install", {
    cwd: projectDirectoryToCreate,
    stdio: "inherit",
  });
  console.log(chalk.green`You're ready to rock!\n Run:\n${chalk.green`cd ${appNameKebapCase} && just run`}\nto begin.`);
};

module.exports = {
  generate,
};
