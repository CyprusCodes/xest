const { submitQuery, getInsertId } = require("~root/lib/database");

const insertOrganization = ({ organizationName }) => submitQuery`
  INSERT INTO
    organizations
      (
        organization_name
      )
      VALUES
      (
        ${organizationName}
      )
`;

module.exports = getInsertId(insertOrganization);
