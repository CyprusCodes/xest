const selectUserInvitations = require("./queries/selectUserInvitations");

const fetchUserInvitations = async ({ email }) => {
  const userInvitations = await selectUserInvitations({ email });

  return { userInvitations };
};

module.exports = fetchUserInvitations;
