const selectInvitationById = require("./queries/selectInvitationById");

const fetchInvitationById = async ({ invitationId, shortCode }) => {
  const invitation = await selectInvitationById({ invitationId, shortCode });

  return { invitation };
};

module.exports = fetchInvitationById;
