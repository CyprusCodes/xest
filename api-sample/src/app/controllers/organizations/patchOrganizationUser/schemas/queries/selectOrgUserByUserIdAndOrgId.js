const { submitQuery, getFirst } = require("~root/lib/database");

const selectOrgUserByUserIdAndOrgId = ({ orgUserId, orgId }) => submitQuery`
    SELECT 
        user_organization_id
    FROM user_organizations
    WHERE user_id = ${orgUserId} && organization_id = ${orgId}
`;

module.exports = getFirst(
  selectOrgUserByUserIdAndOrgId,
  "user_organization_id"
);
