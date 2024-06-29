const winston = require("winston");
const formatter = require("./formatter");

let transports = [];

transports = [
  new winston.transports.Console({
    level: "debug",
    handleExceptions: true,
    json: true,
    colorize: true
  })
];

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
