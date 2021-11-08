const path = require("path");
const fs = require("fs-extra");

const writeDatabaseJSONFile = (projectRoot, appNameSnakeCase) => {
  const databaseJSON = `  {
    "dev": {
      "driver": "mysql",
      "host": "localhost",
      "port": "3306",
      "user": "root",
      "password": "password",
      "database": "${appNameSnakeCase}_db",
      "multipleStatements": true
    },
    "sql-file": true,
    "defaultEnv": "dev"
  }
`;
  const filePath = path.join(projectRoot, "./.env");
  const doesItExist = fs.ensureFileSync(filePath);
  if (!doesItExist) {
    fs.writeFileSync(filePath, databaseJSON);
  }
};

module.exports = writeDatabaseJSONFile;
