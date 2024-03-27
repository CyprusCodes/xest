const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserOrganizationInvitationsById = ({
  userOrganizationInvitationId
}) => submitQuery`
  SELECT
    COUNT(*) AS count
  FROM
    user_organization_invitations
  WHERE
    user_organization_invitation_id = ${userOrganizationInvitationId}
`;

module.exports = getFirst(selectUserOrganizationInvitationsById, "count");
