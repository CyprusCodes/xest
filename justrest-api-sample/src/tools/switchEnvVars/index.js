/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require("chalk");

function switchEnvVars() {
  const pathToEnvFile = path.join(__dirname, "../../.env");
  const KEYS_TO_SWITCH = [
    "DB_USER",
    "DB_PASSWORD",
    "DB_HOST",
    "APP_ENVIRONMENT",
    "APP_BASE_URL"
  ];
  const envFile = fs.readFileSync(pathToEnvFile).toString();
  const allVarsExist = KEYS_TO_SWITCH.every(key => {
    const count = envFile.split(key).length - 1;
    const isCorrect = count === 2;
    if (!isCorrect) {
      console.log(
        `${key} occurs ${count} time(s) in your .env file.\nMake sure you have 2 defined.\nSecond instance should be prefixed like this: "//${key}="`
      );
      process.exit();
    }
    return count === 2;
  });

  if (allVarsExist) {
    let result = envFile;
    KEYS_TO_SWITCH.forEach(key => {
      result = result.replace(new RegExp(`\n${key}`, "g"), `\nTEMP_${key}`);
    });
    KEYS_TO_SWITCH.forEach(key => {
      // don't believe eslint, this is necessary...
      // eslint-disable-next-line no-useless-escape
      result = result.replace(new RegExp(`\n\/\/${key}`, "g"), `\n${key}`);
    });
    KEYS_TO_SWITCH.forEach(key => {
      result = result.replace(new RegExp(`\nTEMP_${key}`, "g"), `\n//${key}`);
    });
    const newEnvVars = dotenv.parse(Buffer.from(result));
    const switchedToProduction = newEnvVars.DB_HOST !== "localhost";
    if (switchedToProduction) {
      console.log(
        chalk.red("Environment variables switched to PRODUCTION credentials.")
      );
      console.log(chalk.red("With great power comes great responsibility..."));
    } else {
      console.log(
        chalk.green(
          "Environment variables switched to DEVELOPMENT credentials."
        )
      );
    }
    try {
      fs.writeFileSync(pathToEnvFile, result);
    } catch (err) {
      console.log(err);
      console.log(
        "Failed to switch env vars whilst writing new .env file. Your .env file might be corrupted."
      );
    }
  } else {
    console.log("Failed to switch env vars.");
  }
}

switchEnvVars();
