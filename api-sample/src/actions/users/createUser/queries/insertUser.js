const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUser = ({ firstName, lastName, email, password }) => submitQuery`
  INSERT INTO users
  (
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
    SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224),
    2
  )
`;

module.exports = getInsertId(insertUser);
