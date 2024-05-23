const { submitQuery, getFirst, camelKeys } = require("~root/lib/database");

const selectUserOrganizationByEmail = ({ orgId }) => submitQuery`
    SELECT
        organization_name
    FROM organizations
    WHERE organization_id = ${orgId}
`;

module.exports = getFirst(
  camelKeys(selectUserOrganizationByEmail, "organization_name")
);
