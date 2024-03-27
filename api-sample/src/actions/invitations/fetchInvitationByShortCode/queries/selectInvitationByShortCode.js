const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectInvitationByShortCode = ({ shortCode }) => submitQuery`
    SELECT
        user_organization_invitation_id,
        organization_id,
        invited_by,
        user_organization_role_id,
        email
    FROM user_organization_invitations
    WHERE invitation_shortcode = ${shortCode}
    AND accepted_at IS NULL
`;

module.exports = getFirst(camelKeys(selectInvitationByShortCode));
