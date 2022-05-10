const { submitQuery } = require("~root/lib/database");

const updateUserDetails = ({
  userId,
  firstName,
  lastName,
  password
}) => submitQuery`
    UPDATE users
    SET 
      first_name = ${firstName},
      last_name = ${lastName},
      password= SHA2(CONCAT(${password}, ${process.env.PASSWORD_SALT}), 224)
    WHERE user_id = ${userId};
`;

module.exports = updateUserDetails;
