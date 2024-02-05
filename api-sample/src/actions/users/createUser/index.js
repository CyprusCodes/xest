const insertUser = require("./queries/insertUser");

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  isSuperAdmin
}) => {
  const user = await insertUser({
    firstName,
    lastName,
    email,
    password,
    isSuperAdmin
  });

  return { user };
};

module.exports = createUser;
