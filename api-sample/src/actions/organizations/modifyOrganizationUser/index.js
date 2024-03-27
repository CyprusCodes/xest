const updateOrganizationUser = require("./queries/updateOrganizationUser");

const modifyOrganizationUser = async ({
  userId,
  orgId,
  orgUserId,
  userRoleId,
  enabled
}) => {
  const updatedorgUserId = await updateOrganizationUser({
    userId,
    orgId,
    orgUserId,
    userRoleId,
    enabled
  });

  return { updatedorgUserId };
};

module.exports = modifyOrganizationUser;
