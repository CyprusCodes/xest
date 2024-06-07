const appYamlContent = `
name: {{projectName}}
services:
- environment_slug: node-js
  github:
    branch: {{branchName}}
    deploy_on_push: true
    repo: {{repoUrl}}
  name: {{projectName}}
`;

const deployTemplateYamlContent = `
spec:
  name: {{projectName}}
  services:
  - environment_slug: node-js
    git:
      branch: {{branchName}}
      repo_clone_url: {{repoUrl}}
    name: {{projectName}}
`;

module.exports = {
    appYamlContent,
    deployTemplateYamlContent
};
