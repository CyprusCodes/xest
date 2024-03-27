const { submitQuery, camelKeys } = require("~root/lib/database");

const selectOrganizationNameById = ({ organizationId }) => submitQuery`
    SELECT
        organization_name
    FROM organizations
    WHERE organization_id = ${organizationId}
`;

module.exports = camelKeys(selectOrganizationNameById);
