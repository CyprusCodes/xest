const isUnsafeProdDbConn = require("../isUnsafeProdDatabase");

/* eslint-disable no-console */
const exitIfProdDb = () => {
  if (isUnsafeProdDbConn()) {
    console.log("Environment Variable: DB_HOST IS SET TO PRODUCTION");
    console.log("You might be making a BIG MISTAKE.");
    console.log(
      "If you want to continue, and know what you're doing: set ENVIRONMENT VARIABLE `APP_ENVIRONMENT=PRODUCTION`"
    );
    process.exit(1);
  }
};

module.exports = exitIfProdDb;
