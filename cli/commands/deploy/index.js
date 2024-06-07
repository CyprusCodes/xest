const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { appYamlContent, deployTemplateYamlContent } = require("./utils/ymlPath");
const { successMessage, detailsMessage } = require("./utils/logMessage");
const { getGitInfo } = require("./utils/gitConfig");


const deploy = async () => {
    console.log("Starting deployment...");

    const { platform } = await inquirer.prompt({
        type: "list",
        name: "platform",
        message: "Select the deployment platform",
        choices: ["Digital Ocean", "AWS"]
    });

    if (platform === "Digital Ocean") {
        const { projectName, branchName, repoUrl } = getGitInfo();

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
