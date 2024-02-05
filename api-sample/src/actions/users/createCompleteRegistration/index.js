const insertCompleteRegistration = require("./queries/insertCompleteRegistration");

const createCompleteRegistration = async ({
  firstName,
  lastName,
  email,
  password,
  companyName
}) => {
  const userId = await insertCompleteRegistration({
    firstName,
    lastName,
    email,
    password,
    companyName
  });

  return { userId };
};

module.exports = createCompleteRegistration;
