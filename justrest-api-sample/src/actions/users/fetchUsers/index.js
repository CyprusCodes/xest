const selectUsers = require("./queries/selectUsers");

const fetchUsers = async () => {
  const users = await selectUsers();

  return { users };
};

module.exports = fetchUsers;
