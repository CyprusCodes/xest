const insertRegistrationRequest = require("./queries/insertRegistrationRequest");

  const createRegistrationRequest = async ({
    firstName,
    lastName,
    email,
    password,
    companyName,
    phoneNumber,
    userTypeId,
    registrationShortcode,
  }) => {
  const createdRegistrationRequest = await insertRegistrationRequest({
    firstName,
    lastName,
    email,
    password,
    companyName,
    phoneNumber,
    userTypeId,
    registrationShortcode,
  });

  return { createdRegistrationRequest };
};

module.exports = createRegistrationRequest;
