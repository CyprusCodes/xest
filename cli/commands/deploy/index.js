const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const { appYamlContent, deployTemplateYamlContent, configYmlContentAws } = require("./utils/ymlPath");
const { cdkJsonContentFiles } = require("./utils/cdkJson");
const { successMessage, detailsMessage } = require("./utils/logMessage");
const { getGitInfo } = require("./utils/gitConfig");
const { toSnakeCase } = require("./utils/stringUtils");
const { indexFile, rdsFile, vpcFile, elasticFile, variableFile } = require("./utils/stack");
const findProjectRoot = require("../../utils/findProjectRoot");
const chalk = require("chalk");

const deploy = async () => {
  const projectDetails = findProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a Xest project directory. Please check your current path directory.`
    );
    return;
  }

  const {
    value: { name: projectName },
  } = projectDetails;

  console.log(
    chalk.green`Starting deployment...`
  );

  const { platform } = await inquirer.prompt({
    type: "list",
    name: "platform",
    message: "Select the deployment platform",
    choices: ["Digital Ocean", "AWS"]
  });

  const projectRootPath = process.cwd();

  if (platform === "Digital Ocean") {
    const { branchName, repoUrl } = getGitInfo();

    const deployFolderPath = path.join(projectRootPath, '.do');

    if (fs.existsSync(deployFolderPath)) {
      console.log("Deployment .do directory already exists. Nothing to do.");
      return;
    }

    const appYamlPath = path.join(deployFolderPath, 'app.yaml');
    const deployTemplateYamlPath = path.join(deployFolderPath, 'deploy.template.yaml');

    if (!fs.existsSync(deployFolderPath)) {
      fs.mkdirSync(deployFolderPath);
    }

    const appYamlContentFilled = appYamlContent
      .replace(/{{projectName}}/g, projectName)
      .replace(/{{branchName}}/g, branchName)
      .replace(/{{repoUrl}}/g, repoUrl);

    const deployTemplateYamlContentFilled = deployTemplateYamlContent
      .replace(/{{projectName}}/g, projectName)
      .replace(/{{branchName}}/g, branchName)
      .replace(/{{repoUrl}}/g, repoUrl);

    fs.writeFileSync(appYamlPath, appYamlContentFilled);
    fs.writeFileSync(deployTemplateYamlPath, deployTemplateYamlContentFilled);

    console.log(successMessage);
    console.log(detailsMessage);

  } else if (platform === "AWS") {
    const cdkJsonPath = path.join(projectRootPath, 'cdk.json');
    const circleciFolderPath = path.join(projectRootPath, '.circleci');
    const configYmlPath = path.join(circleciFolderPath, 'config.yml');
    const stackFolderPath = path.join(projectRootPath, 'stack');

    if (
      fs.existsSync(cdkJsonPath) &&
      fs.existsSync(configYmlPath) &&
      fs.existsSync(stackFolderPath) &&
      fs.existsSync(path.join(stackFolderPath, 'index.ts')) &&
      fs.existsSync(path.join(stackFolderPath, 'rds.ts')) &&
      fs.existsSync(path.join(stackFolderPath, 'vpc.ts')) &&
      fs.existsSync(path.join(stackFolderPath, 'elastic-beanstalk.ts')) &&
      fs.existsSync(path.join(stackFolderPath, 'variables.js'))
    ) {
      console.log(chalk.yellow`AWS deployment setup already exists. ${chalk.cyan("Nothing to do.")} `);
      return;
    }

    console.log("Installing AWS CDK packages...");
    execSync("npm install aws-cdk-lib constructs @types/node -D", { stdio: "inherit" });

    const cdkJsonContent = cdkJsonContentFiles;

    fs.writeFileSync(cdkJsonPath, cdkJsonContent);

    if (!fs.existsSync(circleciFolderPath)) {
      fs.mkdirSync(circleciFolderPath);
    }

    const snakeCaseProjectName = toSnakeCase(projectName);
    const configYmlContent = configYmlContentAws.replace(/{{projectName}}_db/g, `${snakeCaseProjectName}_db`);

    fs.writeFileSync(configYmlPath, configYmlContent);

    console.log("Creating stack directory and files...");

    if (!fs.existsSync(stackFolderPath)) {
      fs.mkdirSync(stackFolderPath);
    }

    // Write content to each file from the imported variables
    fs.writeFileSync(path.join(stackFolderPath, 'index.ts'), indexFile.replace(/{{projectName}}/g, projectName));
    fs.writeFileSync(path.join(stackFolderPath, 'rds.ts'), rdsFile.replace(/{{projectName}}_db/g, `${snakeCaseProjectName}_db`));
    fs.writeFileSync(path.join(stackFolderPath, 'vpc.ts'), vpcFile);
    fs.writeFileSync(path.join(stackFolderPath, 'elastic-beanstalk.ts'), elasticFile);
    fs.writeFileSync(path.join(stackFolderPath, 'variables.js'), variableFile.replace(/{{projectName}}_db/g, `${snakeCaseProjectName}_db`));

    console.log("AWS CDK setup complete. Files created successfully.");
    console.log(chalk.yellow`Please go to the ${chalk.cyan('variables.js')} file inside the ${chalk.cyan('stack')} directory to make the necessary changes.`);
  }
};

module.exports = {
  deploy
};
