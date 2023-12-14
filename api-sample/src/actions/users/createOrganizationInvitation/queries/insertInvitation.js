const {
  submitQuery,
  getInsertId,
  sqlValueOrNull
} = require("~root/lib/database");

const insertOrganizationInvitation = ({
  userId,
  orgId,
  email,
  userRoleId,
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
    user_role_id
  )
VALUES
  (
    ${email},
    ${sqlValueOrNull(comment)}, 
    ${invitationShortcode},
    ${userId},
    ${orgId},
    ${userRoleId}
  );
`;

module.exports = getInsertId(insertOrganizationInvitation);
