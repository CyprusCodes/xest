const { submitQuery, getFirst } = require("~root/lib/database");

const selectInvitation = ({ email, orgId, userTypeId }) => submitQuery`
    SELECT
        user_organization_invitation_id
    FROM user_organization_invitations
    WHERE email = ${email} && organization_id = ${orgId} && user_type_id = ${userTypeId}
`;

module.exports = getFirst(selectInvitation, "user_organization_invitation_id");
