const deleteInvitation = require("./queries/deleteInvitation");

const removeInvitation = async ({ invitationId }) => {
  const invitation = await deleteInvitation({
    invitationId
  });
  return { invitation };
};

module.exports = removeInvitation;
