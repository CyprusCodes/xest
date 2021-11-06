const inquirer = require("inquirer");
const chalk = require("chalk");
const { execSync } = require("child_process");
const findJustRestProjectRoot = require("./utils/findProjectRoot");

const run = async (appName) => {
  const projectDetails = findJustRestProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a justREST project directory. Please check your current path directory.`
    );
    return;
  }
  console.log(projectDetails);
  // run docker instance if it's not running
  // run db-migrations if necessary
  // npm run dev
};

module.exports = {
  run,
};
