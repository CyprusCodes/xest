const selectInvitationById = require("./queries/selectInvitationByShortCode");

const fetchInvitationByShortCode = async ({ shortCode }) => {
  const invitation = await selectInvitationById({ shortCode });

  return { invitation };
};

module.exports = fetchInvitationByShortCode;
