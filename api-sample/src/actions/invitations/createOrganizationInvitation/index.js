const insertOrganizationInvitation = require("./queries/insertOrganizationInvitation");

const createOrganizationInvitation = async ({
  userId,
  orgId,
  email,
  userOrganizationRoleId,
  comment,
  invitationShortcode
}) => {
  const newInvitationId = await insertOrganizationInvitation({
    userId,
    orgId,
    email,
    userOrganizationRoleId,
    comment,
    invitationShortcode
  });

  return { newInvitationId };
};

module.exports = createOrganizationInvitation;
