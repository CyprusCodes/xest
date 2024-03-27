const selectUserOrganizations = require("./queries/selectUserOrganizations");

const fetchUserOrganizations = async ({ userId }) => {
  const organizations = await selectUserOrganizations({ userId });

  return { organizations };
};

module.exports = fetchUserOrganizations;
