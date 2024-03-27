const { submitQuery, getFirst } = require("~root/lib/database");

const selectOrgUserByUserId = ({ newOrgUserUserId, orgId }) => submitQuery`
    SELECT
        user_organization_id
    FROM user_organizations
    WHERE user_id = ${newOrgUserUserId} && organization_id = ${orgId}
`;

module.exports = getFirst(selectOrgUserByUserId, "user_organization_id");
