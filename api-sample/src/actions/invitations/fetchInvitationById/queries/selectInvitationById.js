const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectInvitationById = ({ invitationId, shortCode }) => submitQuery`
    SELECT 
        user_organization_invitation_id,
        organization_id,
        invited_by,
        user_role_id
    FROM user_organization_invitations
    WHERE user_organization_invitation_id = ${invitationId}
    AND invitation_shortcode = ${shortCode}
    AND accepted_at IS NULL
`;

module.exports = getFirst(camelKeys(selectInvitationById));
// ORDER BY created_at DESC
