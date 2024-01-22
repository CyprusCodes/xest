const selectUserRoles = require("./queries/selectUserRoles");

const fetchUserRoles = async () => {
  const userRoles = await selectUserRoles();

  return { userRoles };
};

module.exports = fetchUserRoles;
