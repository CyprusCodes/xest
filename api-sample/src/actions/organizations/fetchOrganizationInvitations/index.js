const selectOrganizationInvitations = require("./queries/selectOrganizationInvitations");

const fetchOrganizationInvitations = async ({ orgId }) => {
  const invitations = await selectOrganizationInvitations({ orgId });

  return { invitations };
};

module.exports = fetchOrganizationInvitations;
