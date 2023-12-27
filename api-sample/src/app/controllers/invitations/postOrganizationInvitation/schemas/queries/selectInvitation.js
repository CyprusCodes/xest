const { submitQuery, getFirst } = require("~root/lib/database");

const selectInvitation = ({ email, orgId, userRoleId }) => submitQuery`
    SELECT 
        user_organization_invitation_id
    FROM user_organization_invitations
    WHERE email = ${email} && organization_id = ${orgId} && user_role_id = ${userRoleId}
`;

module.exports = getFirst(selectInvitation, "user_organization_invitation_id");
