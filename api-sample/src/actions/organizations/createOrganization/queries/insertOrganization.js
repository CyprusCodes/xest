const {
  submitQuery,
  getInsertId
} = require("~root/lib/database");

const insertOrganization = ({ companyName }) => submitQuery`
  INSERT INTO
    organizations
      (
        organization_name
      )
      VALUES
      (
        ${companyName}
      )
`;

module.exports = getInsertId(insertOrganization);
