const insertRecoveryRequest = require("./queries/insertRecoveryRequest");

const createRecoveryRequest = async ({ requestedEmail, URLshortcode }) => {
  const requestId = await insertRecoveryRequest({
    requestedEmail,
    URLshortcode
  });

  return { requestId };
};

module.exports = createRecoveryRequest;
