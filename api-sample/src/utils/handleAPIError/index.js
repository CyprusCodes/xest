const { ValidationError } = require("yup");
const monitoring = require("~root/utils/monitoring");
const parseYupError = require("~root/utils/parseYupError");
const { BAD_REQUEST, ERROR } = require("~root/constants/HttpStatusCodes");

const GENERIC_ERROR_MESSAGE = "API Error";

const handleAPIError = (res, err, statusCode = ERROR) => {
  if (!(err instanceof ValidationError)) {
    monitoring.error(err);
    res.status(statusCode);
    res.send(GENERIC_ERROR_MESSAGE);
    return;
  }
  res.status(BAD_REQUEST);
  res.send(parseYupError(err));
};

module.exports = handleAPIError;
