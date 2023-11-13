const insertOrganizationUser = require("./queries/insertOrganizationUser");

const createOrganizationUser = async ({
  newOrgUserUserId,
  userRoleId,
  orgId,
  userId
}) => {
  const organizationUserId = await insertOrganizationUser({
    newOrgUserUserId,
    userRoleId,
    orgId,
    userId
  });

  return { organizationUserId };
};

module.exports = createOrganizationUser;
