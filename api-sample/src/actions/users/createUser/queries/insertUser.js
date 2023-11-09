const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUser = ({
  firstName,
  lastName,
  email,
  password,
  userTypeId
}) => submitQuery`
  INSERT INTO users
  (
    first_name,
    last_name,
    email,
    password,
    user_type_id
  )
  VALUES
  (
    ${firstName},
    ${lastName},
    ${email},
    SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224),
    ${userTypeId}
  )
`;

module.exports = getInsertId(insertUser);
