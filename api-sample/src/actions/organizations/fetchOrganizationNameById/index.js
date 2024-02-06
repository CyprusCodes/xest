const selectOrganizationNameById = require("./queries/selectOrganizationNameById");

const fetchOrganizationNameById = async ({ organizationId }) => {
  const organizationName = await selectOrganizationNameById({ organizationId });

  return { organizationName };
};

module.exports = fetchOrganizationNameById;
