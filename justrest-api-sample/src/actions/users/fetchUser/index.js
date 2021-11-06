const selectUser = require("./queries/selectUser");

const fetchUser = async ({ email, password }) => {
  const user = await selectUser({ email, password });

  return { user };
};

module.exports = fetchUser;
