const updateUserDetails = require("./queries/updateUserInvitation");

const modifyUserInvitation = async ({ invitationId, shortcode }) => {
  const patchedInvitationId = await updateUserDetails({
    invitationId,
    shortcode
  });

  return { patchedInvitationId };
};

module.exports = modifyUserInvitation;
