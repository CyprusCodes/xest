const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const deploy = async () => {
    console.log("Starting deployment...");

    const { platform } = await inquirer.prompt({
        type: "list",
        name: "platform",
        message: "Select the deployment platform",
        choices: ["Digital Ocean", "AWS"]
    });

    if (platform === "Digital Ocean") {
        const projectRootPath = process.cwd();
        const deployFolderPath = path.join(projectRootPath, '.do');
        const appYamlPath = path.join(deployFolderPath, 'app.yaml');
        const deployTemplateYamlPath = path.join(deployFolderPath, 'deploy.template.yaml');

        if (!fs.existsSync(deployFolderPath)) {
            fs.mkdirSync(deployFolderPath);
        }

        fs.writeFileSync(appYamlPath, `name: project_name\nservices:\n- environment_slug: node-js\n  github:\n    branch: your_deployment_branch\n    deploy_on_push: true\n    repo: github_profile/project\n  name: project_name\n`);

        fs.writeFileSync(deployTemplateYamlPath, `spec:\n  name: project_name\n  services:\n  - environment_slug: node-js\n    git:\n      branch: your_deployment_branch\n      repo_clone_url: https://github.com/github_profile/project.git\n    name: project_name\n`);

        console.log("Deployment files created successfully for Digital Ocean.");
        console.log("For more details on deploying to Digital Ocean, including creating your droplet and more, visit: \x1b[34mhttps://franckyulquiorra.medium.com/deploy-xest-api-on-digital-ocean-a8f3820dbd37\x1b[0m");
    } else if (platform === "AWS") {
        console.log("AWS deployment coming soon.");
    }
};

module.exports = {
    deploy
};
