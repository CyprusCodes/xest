const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUserInvitations = ({ email }) => submitQuery`
    SELECT
        user_organization_invitations.user_organization_invitation_id,
        user_organization_invitations.invitation_shortcode,
        user_organization_invitations.organization_id,
        user_organization_invitations.email,
        user_organization_invitations.invited_by,
        user_organization_invitations.user_role_id,
        user_organization_invitations.comment,
        user_organization_invitations.sent_at,
        user_organization_invitations.accepted_at,
        user_organization_invitations.declined_at,
        user_organization_invitations.updated_at,
        users.first_name as invitedByFirstName,
        users.last_name as invitedByLastName,
        user_roles.user_role,
        organizations.organization_name
    FROM user_organization_invitations
    LEFT JOIN users ON users.user_id = user_organization_invitations.invited_by
    LEFT JOIN user_roles ON user_roles.user_role_id = user_organization_invitations.user_role_id
    LEFT JOIN organizations ON organizations.organization_id = user_organization_invitations.organization_id
    WHERE user_organization_invitations.email = ${email}
    ORDER BY sent_at DESC
`;

module.exports = camelKeys(selectUserInvitations);
