// adapted from
// https://github.com/eugeny-dementev/winston-console-formatter/issues/12
// https://github.com/eugeny-dementev/winston-console-formatter/issues/12#issuecomment-435263280
const utils = require("winston-console-formatter/dist/utils");
const Message = require("winston-console-formatter/dist/message");
const Colorizer = require("winston-console-formatter/dist/colorizer");
const defaultErrorColors = require("winston-console-formatter/dist/colors");
const yamlifyColors = require("yamlify-object-colors");

const winston = require("winston");
const yamlifyObject = require("yamlify-object");

const MESSAGE = Symbol.for("message");

const getInfoMessagePlainText = (infoMessage, options) => {
  if (typeof infoMessage === "object") {
    return yamlifyObject(infoMessage, {
      colors: options.types,
      indent: "  ",
      prefix: "\n",
      postfix: ""
    });
  }
  return infoMessage;
};

module.exports = winston.format((info, options = {}) => {
  // eslint-disable-next-line no-param-reassign
  options = {
    ...options,
    prefix: "",
    postfix: "",
    stackTrace: true,
    colors: defaultErrorColors,
    types: yamlifyColors
  };

  const remainingInfo = { ...info };
  delete remainingInfo.from;
  delete remainingInfo.stack;
  delete remainingInfo.trace;
  delete remainingInfo.message;
  delete remainingInfo.timestamp;
  delete remainingInfo.label;
  delete remainingInfo.level;

  const stackTraceRaw = info.stack || info.trace;
  let stackTraceJoined;
  let stackTraceMesssage;

  if (!info.message && Array.isArray(stackTraceRaw)) {
    // eslint-disable-next-line prefer-destructuring
    stackTraceMesssage = stackTraceRaw[0];
  }

  if (Array.isArray(stackTraceRaw)) {
    stackTraceJoined = stackTraceRaw.join("\n");
  }

  let formattedMessage = new Message()
    .setColorizer(new Colorizer(info.colors || options.colors))
    .setTime(info.timestamp || options.timestamp)
    .setLabel(info.label || options.label)
    .setLevel(info.level || options.level)
    .setFrom(info.from)
    .setMessage(
      stackTraceMesssage || getInfoMessagePlainText(info.message, options)
    )
    .toString();

  if (options.stackTrace) {
    formattedMessage += utils.getStackTrace(
      stackTraceJoined === undefined ? stackTraceRaw : stackTraceJoined,
      Boolean(options.colors)
    );
  }

  formattedMessage += yamlifyObject(remainingInfo, {
    colors: options.types,
    indent: "  ",
    prefix: "\n",
    postfix: ""
  });

  // eslint-disable-next-line no-param-reassign
  info[MESSAGE] = `${options.prefix}${formattedMessage}${options.postfix}`;
  return info;
});
