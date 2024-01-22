const insertCompleteRegistration = require("./queries/insertCompleteRegistration");

const createCompleteRegistration = async ({
  firstName,
  lastName,
  email,
  password,
  companyName,
  phoneNumber,
  userTypeId
}) => {
  const userId = await insertCompleteRegistration({
    firstName,
    lastName,
    email,
    password,
    companyName,
    phoneNumber,
    userTypeId
  });

  return { userId };
};

module.exports = createCompleteRegistration;
