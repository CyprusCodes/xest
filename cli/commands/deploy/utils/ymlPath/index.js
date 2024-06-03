const appYamlContent = `
name: project_name
services:
- environment_slug: node-js
  github:
    branch: your_deployment_branch
    deploy_on_push: true
    repo: github_profile/project
  name: project_name
`;

const deployTemplateYamlContent = `
spec:
  name: project_name
  services:
  - environment_slug: node-js
    git:
      branch: your_deployment_branch
      repo_clone_url: https://github.com/github_profile/project.git
    name: project_name
`;

module.exports = {
    appYamlContent,
    deployTemplateYamlContent
};
