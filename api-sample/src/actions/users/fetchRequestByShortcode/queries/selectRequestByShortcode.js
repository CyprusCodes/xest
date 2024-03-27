const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectRequestByShortcode = ({ shortcode }) => submitQuery`
    SELECT
        password_recovery_request_id,
        email,
        shortcode,
        recovered_at,
        expiry_date,
        created_at
    FROM password_recovery_requests
    WHERE shortcode = ${shortcode}
`;

module.exports = getFirst(camelKeys(selectRequestByShortcode));
