const selectUserById = require("./queries/selectUserById");

const fetchUserById = async ({ userId }) => {
  const user = await selectUserById({ userId });

  return { user };
};

module.exports = fetchUserById;
