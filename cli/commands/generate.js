const inquirer = require("inquirer");
const snakeCase = require("lodash/snakeCase");
const kebabCase = require("lodash/kebabCase");
const chalk = require("chalk");
const findProjectRoot = require("../utils/findProjectRoot");
const { writeFile, writeDirectory } = require("../utils/createFile");
const asyncSeries = require("../utils/asyncSeries");
const writeDotEnvFile = require("../utils/writeDotEnvFile");
const writeDatabaseJSONFile = require("../utils/writeDatabaseJSONFile");
const writeGitIgnoreFile = require("../utils/writeGitIgnoreFile");
const fs = require("fs");
const path = require("path");
const { fdir } = require("fdir");
const replace = require("replace-in-file");
const execa = require("execa");

const generate = (program) => async (appName) => {
  const projectRoot = findProjectRoot();
  if (projectRoot) {
    console.log(
      chalk.red`You are already in a Xest project directory. No need to scaffold a new API. Exiting.`
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
    "../../../",
    "api-sample/"
  );
  const projectDirectoryToCreate = path.join(process.cwd(), appNameKebapCase);

  if (!fs.existsSync(projectDirectoryToCreate)) {
    fs.mkdirSync(projectDirectoryToCreate, { recursive: true });
  }

  const sourceProjectFiles = new fdir()
    .withBasePath()
    .withDirs()
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
  await writeDotEnvFile(projectDirectoryToCreate, appNameSnakeCase);
  await writeDatabaseJSONFile(projectDirectoryToCreate, appNameSnakeCase);
  await writeGitIgnoreFile(projectDirectoryToCreate);
  await execa(`npm install`, {
    cwd: projectDirectoryToCreate,
    shell: true,
  });
  console.log(
    chalk.green`You're ready to go!\n Type ${chalk.green`cd ${appNameKebapCase} && xx run`} to begin.`
  );
};

module.exports = {
  generate,
};
