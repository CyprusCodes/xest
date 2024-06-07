const path = require("path");
const { execSync } = require("child_process");

const getGitInfo = () => {
    let projectName, branchName, repoUrl;
    try {
        projectName = path.basename(process.cwd());
        branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
        repoUrl = execSync("git config --get remote.origin.url").toString().trim();
    } catch (error) {
        console.warn("Warning: Not a git repository or unable to read git info. Using default values.");
        projectName = "project_name";
        branchName = "your_deployment_branch";
        repoUrl = "https://github.com/github_profile/project";
    }
    return { projectName, branchName, repoUrl };
};

module.exports = {
    getGitInfo
};
