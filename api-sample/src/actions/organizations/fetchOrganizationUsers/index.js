const selectOrganizationUsers = require("./queries/selectOrganizationUsers");

const fetchOrganizationUsers = async ({ orgId }) => {
  const organizationUsers = await selectOrganizationUsers({ orgId });

  return { organizationUsers };
};

module.exports = fetchOrganizationUsers;
