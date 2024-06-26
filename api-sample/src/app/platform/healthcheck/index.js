const fs = require("fs");
const handleAPIError = require("~root/utils/handleAPIError");
const getMySQLVersion = require("./queries/getMySQLVersion");

const healthcheck = async (req, res) => {
  try {
    const mysqlVersion = await getMySQLVersion();
    const appVersion = await fs.readFileSync("./COMMIT_HASH").toString();

    res.status(200).send({ mysqlVersion, appVersion });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = healthcheck;
