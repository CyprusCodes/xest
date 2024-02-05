const insertCompleteRegistration = require("./queries/insertCompleteRegistration");

const createCompleteRegistration = async ({
  firstName,
  lastName,
  email,
  password,
  companyName,
  userRoleId
}) => {
  const userId = await insertCompleteRegistration({
    firstName,
    lastName,
    email,
    password,
    companyName,
    userRoleId
  });

  return { userId };
};

module.exports = createCompleteRegistration;
