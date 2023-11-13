const insertOrganizationInvitation = require("./queries/insertOrganizationInvitation");

const createOrganizationInvitation = async ({
  userId,
  orgId,
  email,
  userRoleId,
  comment,
  invitationShortcode
}) => {
  const newInvitationId = await insertOrganizationInvitation({
    userId,
    orgId,
    email,
    userRoleId,
    comment,
    invitationShortcode
  });

  return { newInvitationId };
};

module.exports = createOrganizationInvitation;
