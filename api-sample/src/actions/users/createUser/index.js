const insertUser = require("./queries/insertUser");

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  userTypeId
}) => {
  const user = await insertUser({
    firstName,
    lastName,
    email,
    password,
    userTypeId
  });

  return { user };
};

module.exports = createUser;
