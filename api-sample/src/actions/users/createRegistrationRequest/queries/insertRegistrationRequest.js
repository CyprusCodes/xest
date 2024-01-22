const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUser = ({
  firstName,
  lastName,
  email,
  password,
  userRoleId
}) => submitQuery`
    INSERT INTO users (
      first_name,
      last_name,
      email,
      password,
      user_role_id
    )
    VALUES
    (
      ${firstName},
      ${lastName},
      ${email},
      ${password},
      ${userRoleId}
    );
`;
module.exports = getInsertId(insertUser);
