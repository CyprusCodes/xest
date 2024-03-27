const insertRegistrationRequest = require("./queries/insertRegistrationRequest");

const createRegistrationRequest = async ({
  firstName,
  lastName,
  email,
  password,
  organizationName,
  registrationShortcode
}) => {
  const createdRegistrationRequest = await insertRegistrationRequest({
    firstName,
    lastName,
    email,
    password,
    organizationName,
    registrationShortcode
  });

  return { createdRegistrationRequest };
};

module.exports = createRegistrationRequest;
