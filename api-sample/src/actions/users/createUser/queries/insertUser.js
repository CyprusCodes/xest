const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUser = ({
  firstName,
  lastName,
  email,
  password,
  isSuperAdmin
}) => submitQuery`
  INSERT INTO users
  (
    first_name,
    last_name,
    email,
    password,
    is_super_admin
  )
  VALUES
  (
    ${firstName},
    ${lastName},
    ${email},
    SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224),
    ${isSuperAdmin}
  )
`;

module.exports = getInsertId(insertUser);
