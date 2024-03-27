const { submitQuery, getFirst } = require("~root/lib/database");

const selectInvitation = ({ invitationShortcode }) => submitQuery`
    SELECT 
        user_organization_invitation_id
    FROM user_organization_invitations
    WHERE  invitation_shortcode = ${invitationShortcode};
`;

module.exports = getFirst(selectInvitation, "user_organization_invitation_id");
