const selectUserInvitation = require("./queries/selectUserInvitation");

const fetchUserInvitation = async ({ email, invitationId, shortcode }) => {
  const invitation = await selectUserInvitation({
    email,
    invitationId,
    shortcode
  });

  return { invitation };
};

module.exports = fetchUserInvitation;
