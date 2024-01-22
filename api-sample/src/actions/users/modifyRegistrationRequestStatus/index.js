const updateRegistrationRequestStatus = require("./queries/updateRegistrationRequestStatus");

const modifyRegistrationRequestStatus = async ({ registrationShortcode }) => {
  const registrationRequestStatus = await updateRegistrationRequestStatus({
    registrationShortcode
  });
  return { registrationRequestStatus };
};

module.exports = modifyRegistrationRequestStatus;
