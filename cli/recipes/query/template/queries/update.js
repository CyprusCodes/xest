const { submitQuery } = require("~root/database");

const update{{entityName}} = ({
    address,
    country,
    userId,
}) => submitQuery`
    UPDATE users
    SET 
    address = ${address},
    country = ${country}
    WHERE
    user_id = ${userId};
`;

module.exports = update{{entityName}};