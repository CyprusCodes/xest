const insertUser = require("./queries/insertUser");

const createUser = async ({ firstName, lastName, email, password }) => {
  const user = await insertUser({
    firstName,
    lastName,
    email,
    password
  });

  return { user };
};

module.exports = createUser;
