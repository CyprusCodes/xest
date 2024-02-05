const {
  submitQuery,
  getInsertId,
  sqlValueOrNull
} = require("~root/lib/database");

const insertOrganizationInvitation = ({
  userId,
  orgId,
  email,
  userOrganizationRoleId,
  comment,
  invitationShortcode
}) => submitQuery`
  INSERT INTO
  user_organization_invitations(
    email,
    comment,
    invitation_shortcode,
    invited_by,
    organization_id,
    user_organization_role_id
  )
VALUES
  (
    ${email},
    ${sqlValueOrNull(comment)},
    ${invitationShortcode},
    ${userId},
    ${orgId},
    ${userOrganizationRoleId}
  );
`;

module.exports = getInsertId(insertOrganizationInvitation);
