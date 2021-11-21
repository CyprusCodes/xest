const updateUserDetails = require("./queries/updateUserDetails");

const modifyUser = async ({ userId, firstName, lastName, password }) => {
  const userDetails = await updateUserDetails({
    userId,
    firstName,
    lastName,
    password
  });

  return { userDetails };
};

module.exports = modifyUser;
