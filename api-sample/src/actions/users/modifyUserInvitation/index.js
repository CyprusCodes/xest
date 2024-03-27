const updateUserInvitation = require("./queries/updateUserInvitation");

const modifyUserInvitation = async ({ invitationId, shortcode }) => {
  const patchedInvitationId = await updateUserInvitation({
    invitationId,
    shortcode
  });

  return { patchedInvitationId };
};

module.exports = modifyUserInvitation;
