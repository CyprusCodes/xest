const { sql } = require("~root/lib/database");
const { paginate, FILTERS } = require("~root/lib/paginate");
const handleAPIError = require("~root/utils/handleAPIError");
const getAllUsersByOrgIdSchema = require("./schemas/getAllUsersByOrgIdSchema");

const getAllUsersByOrgId = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;
  try {
    await getAllUsersByOrgIdSchema.validate(
      { userId, orgId },
      { abortEarly: false }
    );
    const resultset = await paginate({
      basePath: req.path,
      baseTable: "user_organizations",
      selectFields: [
        "user_organizations.user_organization_id",
        "users.first_name",
        "users.last_name",
        "users.email",
        "user_organizations.organization_id",
        "users.current_situation",
        "users.is_employed",
        "user_organizations.user_role_id",
        "user_organizations.created_at",
        "user_organizations.disabled_at",
        "user_organizations.disabled_by",
        "user_organizations.updated_at",
        "user_organizations.user_id",
        "user_organizations.added_by",
        sql`u1.first_name as added_by_firstname`,
        sql`u1.last_name as added_by_lastname`
      ],
      joinStatements: [
        sql`LEFT JOIN user_roles ON user_organizations.user_role_id = user_roles.user_role_id`,
        sql`LEFT JOIN users ON user_organizations.user_id = users.user_id`,
        sql`LEFT JOIN users u1 ON u1.user_id = user_organizations.added_by`
      ],
      sortableAttributes: ["user_organizations.user_organization_id"],
      groupBy: ["user_organizations.user_organization_id"],
      filterableAttributes: [
        {
          column: "user_organizations.user_role_id",
          operations: [FILTERS.equals]
        },
        {
          column: "users.user_id",
          operations: [
            FILTERS.containsIgnoreCase,
            {
              operator: "searchOrgUsersByFullName",
              description: "search org users by fullname",
              minimumNumberOfOperands: 1,
              maximumNumberOfOperands: 1,
              filterFn: operands => {
                const filterString = operands[0];
                if (filterString) {
                  return sql`(LOWER(users.first_name) LIKE ${`%${filterString}%`} OR LOWER(users.last_name) LIKE ${`%${filterString}%`}) `;
                }
                return sql``;
              }
            },
            {
              operator: "showInactiveOnly",
              description:
                "show users who are not assigned for particular event",
              minimumNumberOfOperands: 1,
              maximumNumberOfOperands: 999,
              filterFn: operands => {
                const eventId = operands[0];
                if (eventId) {
                  return sql`users.user_id NOT IN (
                    select user_id from event_staff 
	                  inner join user_organizations ON event_staff.user_organization_id = user_organizations.user_organization_id
	                  where event_staff.event_id = ${eventId})`;
                }

                return sql``;
              }
            }
          ]
        },
        {
          column: "user_organizations.organization_id",
          operations: [FILTERS.equals]
        }
      ],
      mandatoryFilter: sql`AND user_organizations.organization_id=${orgId}`,
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

module.exports = getAllUsersByOrgId;
