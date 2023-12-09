const selectRecoveryRequest = require("./queries/selectRecoveryRequest");

const fetchRecoveryRequest = async ({ email, shortcode }) => {
  const requestedEmail = await selectRecoveryRequest({
    email,
    shortcode
  });

  return { requestedEmail };
};

module.exports = fetchRecoveryRequest;
