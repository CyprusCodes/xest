const insertRegistrationRequest = require("./queries/insertRegistrationRequest");

const createRegistrationRequest = async ({
  firstName,
  lastName,
  email,
  password,
  organizationName,
  userRoleId,
  registrationShortcode
}) => {
  const createdRegistrationRequest = await insertRegistrationRequest({
    firstName,
    lastName,
    email,
    password,
    organizationName,
    userRoleId,
    registrationShortcode
  });

  return { createdRegistrationRequest };
};

module.exports = createRegistrationRequest;
