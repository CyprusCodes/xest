const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { appYamlContent, deployTemplateYamlContent } = require("./utils/ymlPath");
const { successMessage, detailsMessage } = require("./utils/logMessage");
const { getGitInfo } = require("./utils/gitConfig");
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

    if (platform === "Digital Ocean") {
        const { branchName, repoUrl } = getGitInfo();

        const projectRootPath = process.cwd();
        const deployFolderPath = path.join(projectRootPath, '.do');
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
        console.log("AWS deployment coming soon.");
    }
};

module.exports = {
    deploy
};
