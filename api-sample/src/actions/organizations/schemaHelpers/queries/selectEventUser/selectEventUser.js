const { submitQuery, getFirst } = require("~root/lib/database");

const selectEventUser = ({ orgId, userId }) => submitQuery`
    SELECT  
         user_organization_id
    FROM user_organizations
    WHERE user_id = ${userId} && organization_id = ${orgId} && (user_role_id = 3 || user_role_id = 4 )
`;

module.exports = getFirst(selectEventUser, "user_organization_id");
