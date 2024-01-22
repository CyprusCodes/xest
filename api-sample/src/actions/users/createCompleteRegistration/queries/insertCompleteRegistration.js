const {
  submitQuery,
  sqlValueOrNull,
  getInsertId
} = require("~root/lib/database");

const insertUser = ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  userRoleId
}) => submitQuery`
    INSERT INTO users (
      first_name,
      last_name,
      email,
      password,
      phone_number,
      user_role_id
    )
    VALUES
    (
      ${firstName},
      ${lastName},
      ${email},
      ${password},
      ${sqlValueOrNull(phoneNumber)},
      ${userRoleId}
    );
`;
module.exports = getInsertId(insertUser);
