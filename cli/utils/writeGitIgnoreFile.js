const path = require("path");
const fs = require("fs-extra");

const writeGitIgnoreFile = (projectRoot) => {
  const dotEnv = `node_modules
.env
*.env
# Elastic Beanstalk Files
.elasticbeanstalk/*
!.elasticbeanstalk/config.yml
!.elasticbeanstalk/*.cfg.yml
!.elasticbeanstalk/*.global.yml
database.json
.DS_Store
.nyc_output/
coverage/
coverage-unit/
full-coverage/
.chipper
chipper-report-*
sls-deployments
.serverless/
serverless/**/package.zip
.vscode/settings.json
.xest
`;
  const filePath = path.join(projectRoot, "./.gitignore");
  const doesItExist = fs.ensureFileSync(filePath);
  if (!doesItExist) {
    fs.writeFileSync(filePath, dotEnv);
  }
};

module.exports = writeGitIgnoreFile;
