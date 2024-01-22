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
  userTypeId
}) => submitQuery`
    INSERT INTO users (
      first_name,
      last_name,
      email,
      password,
      phone_number,
      user_type_id
    )
    VALUES
    (
      ${firstName},
      ${lastName},
      ${email},
      ${password},
      ${sqlValueOrNull(phoneNumber)},
      ${userTypeId}
    );
`;
module.exports = getInsertId(insertUser);
