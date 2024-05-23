const selectOrgOverview = require("./queries/selectOrganizationByEmail");

const fetchOrganizationsByEmail = async ({ email }) => {
  const organizations = await selectOrgOverview({ email });

  return { organizations };
};

module.exports = fetchOrganizationsByEmail;
