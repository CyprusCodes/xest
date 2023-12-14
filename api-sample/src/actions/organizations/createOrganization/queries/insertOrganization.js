const {
  submitQuery,
  getInsertId
} = require("~root/lib/database");

const insertOrganization = ({ name }) => submitQuery`
  INSERT INTO
    organizations
      (
        organization_name
      )
      VALUES
      (
        ${name}
      )
`;

module.exports = getInsertId(insertOrganization);
