const { submitQuery, getFirst } = require("~root/lib/database");

const selectOrganizationByName = ({ organizationName }) => submitQuery`
    SELECT 
        organization_id
    FROM organizations
    WHERE organization_name = ${organizationName}
`;

module.exports = getFirst(selectOrganizationByName, "organization_id");
