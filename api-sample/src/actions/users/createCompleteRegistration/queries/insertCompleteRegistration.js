const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUser = ({ firstName, lastName, email, password }) => submitQuery`
    INSERT INTO users (
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
      ${password},
      0
    );
`;

module.exports = getInsertId(insertUser);
