const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectUser = ({ email, password }) => submitQuery`
    SELECT
        user_id,
        first_name,
        last_name,
        password,
        email,
        user_roles.user_role_id,
        user_roles.user_role
    FROM users
    LEFT JOIN user_roles ON users.user_role_id = user_roles.user_role_id
    WHERE email = ${email}
    AND password = SHA2(CONCAT(${password}, ${process.env.PASSWORD_SALT}), 224);
`;

module.exports = getFirst(camelKeys(selectUser));
