const patchOrganizationInvitation = require("./queries/updateOrganizationInvitation");

const modifyOrganizationInvitation = async ({
  email,
  invitationShortcode,
  orgId
}) => {
  const orgInvitation = await patchOrganizationInvitation({
    email,
    invitationShortcode,
    orgId
  });

  return { orgInvitation };
};

module.exports = modifyOrganizationInvitation;
