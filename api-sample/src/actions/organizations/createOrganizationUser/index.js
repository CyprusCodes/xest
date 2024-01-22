const insertOrganizationUser = require("./queries/insertOrganizationUser");

const createOrganizationUser = async ({
  userId,
  userOrganizationRoleId,
  organizationId,
  addedBy
}) => {
  const organizationUserId = await insertOrganizationUser({
    userId,
    userOrganizationRoleId,
    organizationId,
    addedBy
  });

  return { organizationUserId };
};

module.exports = createOrganizationUser;
