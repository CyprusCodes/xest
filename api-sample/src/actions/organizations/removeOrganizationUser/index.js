const deleteOrganizationUser = require("./queries/deleteOrganizationUser");

const removeOrganizationUser = async ({ orgUserId, orgId }) => {
  const deletedOrgUser = await deleteOrganizationUser({
    orgUserId,
    orgId
  });
  return { deletedOrgUser };
};

module.exports = removeOrganizationUser;
