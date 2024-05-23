const selectOrganizationsByUserId = require("./queries/selectOrganizationsByUserId");

const fetchOrganizationsByUserId = async ({ userId }) => {
  const organizations = await selectOrganizationsByUserId({ userId });

  return { organizations };
};

module.exports = fetchOrganizationsByUserId;
