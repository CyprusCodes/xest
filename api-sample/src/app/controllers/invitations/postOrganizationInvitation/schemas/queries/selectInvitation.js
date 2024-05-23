const { submitQuery, getFirst } = require("~root/lib/database");

const selectInvitation = ({
  email,
  orgId,
  userOrganizationRoleId
}) => submitQuery`
    SELECT 
        user_organization_invitation_id
    FROM user_organization_invitations
    WHERE email = ${email} && organization_id = ${orgId} && user_organization_role_id = ${userOrganizationRoleId}
`;

module.exports = getFirst(selectInvitation, "user_organization_invitation_id");
