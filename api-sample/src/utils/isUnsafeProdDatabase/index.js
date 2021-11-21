/* eslint-disable no-console */
const isUnsafeProdDbConn = () => {
  const dbIsNotLocal = !["localhost", "127.0.0.1"].includes(
    process.env.DB_HOST
  );
  const appEnvIsNotProd = process.env.APP_ENVIRONMENT !== "PRODUCTION";
  const isTestRun =
    process.env.NODE_ENV === "TEST" || process.env.NODE_ENV === "test";
  if (dbIsNotLocal && isTestRun) {
    console.log(
      "You are trying to run the tests against production MySQL Instance!"
    );
    return true;
  }

  if (dbIsNotLocal && appEnvIsNotProd) {
    return true;
  }
  if (dbIsNotLocal) {
    console.log("RUNNING AGAINST PRODUCTION DATABASE!");
  }
  return false;
};

module.exports = isUnsafeProdDbConn;
