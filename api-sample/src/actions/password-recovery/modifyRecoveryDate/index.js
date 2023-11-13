const updateRecoveryDate = require("./queries/updateRecoveryDate");

const modifyRecoveryDate = async ({ email }) => {
  const updatedRequestId = await updateRecoveryDate({
    email
  });

  return { updatedRequestId };
};

module.exports = modifyRecoveryDate;
