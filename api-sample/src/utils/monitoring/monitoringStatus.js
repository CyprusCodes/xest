let LOGGING = true;

const setLoggingStatusTo = newStatus => {
  LOGGING = newStatus;
};

const getLoggingStatus = () => {
  return LOGGING;
};

module.exports = {
  setLoggingStatusTo,
  getLoggingStatus
};
