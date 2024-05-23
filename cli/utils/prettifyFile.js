const { execSync } = require("child_process");

const prettifyFile = (filePath) => {
  return execSync(`npx prettier --write "${filePath}"`, {
    stdio: "inherit",
  });
};

module.exports = prettifyFile;
