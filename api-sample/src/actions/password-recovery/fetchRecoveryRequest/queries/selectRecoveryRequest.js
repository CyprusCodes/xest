const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectRecoveryRequest = ({ email, shortcode }) => submitQuery`
    SELECT
        requested_email,
        shortcode,
        recovered_at,
        expiry_date,
        created_at
    FROM
        password_recovery_requests
    WHERE 
        requested_email = ${email}
        AND shortcode = ${shortcode}
        AND NOW() < expiry_date
        AND recovered_at IS NULL
        ORDER BY created_at DESC
`;

module.exports = getFirst(camelKeys(selectRecoveryRequest), "requestedEmail");
