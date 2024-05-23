const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUserInvitations = ({ email }) => submitQuery`
    SELECT 
        user_organization_invitations.user_organization_invitation_id,
        user_organization_invitations.organization_id,
        user_organization_invitations.email,
        user_organization_invitations.invited_by,
        user_organization_invitations.accepted_at,
        user_organization_invitations.user_type_id,
        user_organization_invitations.sent_at,
        user_organization_invitations.invitation_shortcode,
        users.first_name AS invited_by_first_name,
        users.last_name AS invited_by_last_name,
        u2.first_name AS user_first_name,
        u2.last_name AS user_last_name,
        user_types.user_type,
        organizations.organization_name
    FROM user_organization_invitations
    LEFT JOIN users ON users.user_id = user_organization_invitations.invited_by
    LEFT JOIN users u2 ON u2.email = user_organization_invitations.email
    LEFT JOIN user_types ON user_types.user_type_id = user_organization_invitations.user_type_id
    LEFT JOIN organizations ON organizations.organization_id = user_organization_invitations.organization_id
    WHERE user_organization_invitations.email = ${email}
        ORDER BY user_organization_invitations.user_organization_invitation_id DESC
`;

module.exports = camelKeys(selectUserInvitations);