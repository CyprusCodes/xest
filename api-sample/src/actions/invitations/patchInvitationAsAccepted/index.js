const acceptInvitationQuery = require("./queries/acceptInvitationQuery");

const patchInvitationAsAccepted = async ({ invitationId, shortCode }) => {
  const invitation = await acceptInvitationQuery({ invitationId, shortCode });

  return { invitation };
};

module.exports = patchInvitationAsAccepted;
