const insertRegistrationRequest = require("./queries/insertRegistrationRequest");

  const createRegistrationRequest = async ({
    firstName,
    lastName,
    email,
    password,
    companyName,
    userRoleId,
    registrationShortcode
  }) => {
  const createdRegistrationRequest = await insertRegistrationRequest({
    firstName,
    lastName,
    email,
    password,
    companyName,
    userRoleId,
    registrationShortcode
  });

  return { createdRegistrationRequest };
};

module.exports = createRegistrationRequest;
