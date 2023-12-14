const updatePassword = require("./queries/updatePassword");

const modifyPassword = async ({ email, password }) => {
  const userId = await updatePassword({
    email,
    password
  });

  return { userId };
};

module.exports = modifyPassword;
