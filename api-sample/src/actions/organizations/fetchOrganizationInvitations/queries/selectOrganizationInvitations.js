const { submitQuery, camelKeys } = require("~root/lib/database");

const selectOrganizationInvitations = ({ orgId }) => submitQuery`
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
        users.last_name as invitedByLastName
    FROM user_organization_invitations
    LEFT JOIN users ON users.user_id = user_organization_invitations.invited_by
    WHERE organization_id = ${orgId}
    ORDER BY sent_at DESC
`;

module.exports = camelKeys(selectOrganizationInvitations);
