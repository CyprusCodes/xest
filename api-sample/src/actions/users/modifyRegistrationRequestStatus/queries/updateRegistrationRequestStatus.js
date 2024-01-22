const { submitQuery } = require("~root/lib/database");

const updateRegistrationRequestStatus = ({
  registrationShortcode
}) => submitQuery`
    UPDATE registration_requests
    SET status = "approved",
    updated_at = CURRENT_TIMESTAMP
    WHERE registration_shortcode= ${registrationShortcode};
`;

module.exports = updateRegistrationRequestStatus;
