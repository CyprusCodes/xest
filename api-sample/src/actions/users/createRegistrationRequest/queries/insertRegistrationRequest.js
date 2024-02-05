const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUser = ({
  firstName,
  lastName,
  email,
  password,
  organizationName,
  registrationShortcode
}) => submitQuery`
    INSERT INTO registration_requests (
      first_name,
      last_name,
      email,
      password,
      is_super_admin,
      organization_name,
      registration_shortcode,
      status
    )
    VALUES
    (
      ${firstName},
      ${lastName},
      ${email},
      SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224),
      0,
      ${organizationName},
      ${registrationShortcode},
      "pending"
    );
`;

module.exports = getInsertId(insertUser);
