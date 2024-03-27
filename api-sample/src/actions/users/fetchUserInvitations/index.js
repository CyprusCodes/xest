const selectUserInvitations = require("./queries/selectUserInvitations");

const fetchUserInvitations = async ({ email }) => {
  const invitations = await selectUserInvitations({ email });

  return { invitations };
};

module.exports = fetchUserInvitations;
