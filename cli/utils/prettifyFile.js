const { execSync } = require("child_process");

const prettifyFile = (filePath) => {
  execSync(`npx prettier --write "${filePath}"`, {
    stdio: "inherit",
  });
};

module.exports = prettifyFile;
