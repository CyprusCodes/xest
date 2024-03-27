const { sql } = require("~root/lib/database");
const { paginate, FILTERS } = require("~root/lib/paginate");

const handleAPIError = require("~root/utils/handleAPIError");
const getUserOrganizationInvitationsSchema = require("./schema/getUserOrganizationInvitationsSchema");

const getUserOrganizationInvitations = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;
  try {
    await getUserOrganizationInvitationsSchema.validate(
      { orgId, userId },
      { abortEarly: false }
    );
    const resultset = await paginate({
      basePath: req.path,
      baseTable: "user_organization_invitations",
      selectFields: [
        "user_organization_invitations.user_organization_invitation_id",
        "user_organization_invitations.accepted_at",
        "user_organization_invitations.comment",
        "user_organization_invitations.email",
        "user_organization_invitations.invitation_shortcode",
        "user_organization_invitations.invited_by",
        "user_organization_invitations.organization_id",
        "user_organization_invitations.sent_at",
        "user_organization_invitations.updated_at",
        "user_organization_invitations.user_role_id",
        sql`users.first_name as invited_by_first_name`,
        sql`users.last_name as invited_by_last_name`
      ],
      joinStatements: [
        sql`LEFT JOIN users ON user_organization_invitations.invited_by = users.user_id`
      ],
      sortableAttributes: ["user_organization_invitations.sent_at"],
      filterableAttributes: [
        {
          column:
            "user_organization_invitations.user_organization_invitation_id",
          operations: [FILTERS.equals]
        },
        {
          column: "user_organization_invitations.user_role_id",
          operations: [FILTERS.equals]
        },
        {
          column: "user_organization_invitations.email",
          operations: [FILTERS.containsIgnoreCase]
        }
      ],
      mandatoryFilter: sql`AND user_organization_invitations.organization_id=${orgId}`,
      groupBy: [
        "user_organization_invitations.user_organization_invitation_id"
      ],
      sortBy: req.query.sort_by,
      limit: req.query.page_size,
      page: req.query.page, // "first" | "last" | null
      direction: req.query.direction, // next | previous
      filters: req.query.filters,
      cursorValues: req.query.cursor
    });
    return res.send(resultset);
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getUserOrganizationInvitations;
