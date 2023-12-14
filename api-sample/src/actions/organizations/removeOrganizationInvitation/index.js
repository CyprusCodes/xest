const deleteOrganizationInvitation = require("./queries/deleteOrganizationInvitation");

const removeOrganizationInvitation = async ({ invitationId }) => {
  const invitation = await deleteOrganizationInvitation({
    invitationId
  });
  return { invitation };
};

module.exports = removeOrganizationInvitation;
