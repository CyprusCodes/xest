const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserByOrgId = ({ userId, orgId }) => submitQuery`
    SELECT
        user_organization_id
    FROM user_organizations
    WHERE user_id = ${userId} && organization_id = ${orgId}
`;

module.exports = getFirst(selectUserByOrgId);
