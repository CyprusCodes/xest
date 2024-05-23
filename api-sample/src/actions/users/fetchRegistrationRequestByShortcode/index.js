const selectRegistrationRequestByShortcode = require("./queries/selectRegistrationRequestByShortcode");

const fetchRegistrationRequestByShortcode = async ({
  registrationShortcode
}) => {
  const potentialNewUserData = await selectRegistrationRequestByShortcode({
    registrationShortcode
  });

  return { potentialNewUserData };
};

module.exports = fetchRegistrationRequestByShortcode;
