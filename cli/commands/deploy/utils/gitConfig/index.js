const { execSync } = require("child_process");

const getGitInfo = () => {
    let branchName, repoUrl;
    try {

        branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
        repoUrl = execSync("git config --get remote.origin.url").toString().trim();
    } catch (error) {
        console.warn("Warning: Not a git repository or unable to read git info. Using default values.");
        branchName = "your_deployment_branch";
        repoUrl = "https://github.com/github_profile/project";
    }
    return { branchName, repoUrl };
};

module.exports = {
    getGitInfo
};
