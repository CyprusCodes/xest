/* eslint-disable no-console */
const winston = require("winston");
const get = require("lodash/get");
// const { sendMessage, CHANNELS } = require("~root/services/Slack");
const formatter = require("./formatter");
const {
  PapertrailConnection,
  PapertrailTransport
} = require("./winston-papertrail");

let transports = [];
const ERROR_CODES_TO_IGNORE = ["ERR_SSL_BAD_SIGNATURE", "ECONNRESET"];

if (process.env.APP_ENVIRONMENT === "PRODUCTION-NOPE") {
  const papertrailConnection = new PapertrailConnection({
    host: "j",
    port: 46482
  });

  const winstonPapertrail = new PapertrailTransport(papertrailConnection, {
    hostname: process.env.HOSTNAME
  });

  papertrailConnection.on("error", function noop(err) {
    try {
      // we occasionally get ECONNRESET errors on
      // serverless functions
      // think this is due to functions quitting abruptly
      // but don't believe it's a problem...
      // we also get some SSL handshake errors
      // these seem to be intermittent as well
      if (!ERROR_CODES_TO_IGNORE.includes(get(err, "code"))) {
        console.error(
          `Papertrail reporting has failed on ${process.env.HOSTNAME}`
        );
        console.error(`\n\`\`\`${JSON.stringify(err)}\`\`\``);
      }
    } catch (slackErr) {
      // something went terribly wrong
      console.error(err, slackErr);
    }
  });
  transports = [winstonPapertrail];
} else {
  transports = [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      json: true,
      colorize: true
    })
  ];
}

const logger = winston.createLogger({
  transports,
  exitOnError: false,
  exceptionHandlers: transports,
  format: formatter()
});

// create a stream object with a 'write' function
// that will be used by `morgan`
logger.stream = {
  write(message) {
    // suppress morgan logs whilst running tests
    if (process.env.NODE_ENV !== "test") {
      logger.info(message);
    }
  }
};

const originalLogger = logger.log.bind(logger);
logger.log = function log() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (arguments.length > 1) {
    // eslint-disable-next-line prefer-rest-params
    originalLogger(...arguments);
  } else {
    // eslint-disable-next-line prefer-rest-params
    logger.info(arguments[0]);
  }
};
module.exports = logger;
