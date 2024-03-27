const { submitQuery, getFirst } = require("~root/lib/database");

const selectOrgUserById = ({ orgId, orgUserId }) => submitQuery`
    SELECT
         user_organization_id
    FROM user_organizations
    WHERE user_id = ${orgUserId} && organization_id = ${orgId}
`;

module.exports = getFirst(selectOrgUserById, "user_organization_id");
