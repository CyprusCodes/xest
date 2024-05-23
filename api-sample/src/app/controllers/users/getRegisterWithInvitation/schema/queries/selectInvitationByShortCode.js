const { submitQuery, getFirst } = require("~root/lib/database");

const selectInvitationByShortCode = ({
  invitationShortcode,
  email
}) => submitQuery`
    SELECT
        email
    FROM user_organization_invitations 
    WHERE invitation_shortcode = ${invitationShortcode} && email = ${email}
`;

module.exports = getFirst(selectInvitationByShortCode);
