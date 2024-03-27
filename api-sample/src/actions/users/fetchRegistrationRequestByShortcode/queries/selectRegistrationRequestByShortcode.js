const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectRegistrationRequestByShortcode = ({
  registrationShortcode
}) => submitQuery`
    SELECT
      first_name,
      last_name,
      email,
      password,
      organization_name
    FROM registration_requests
    WHERE registration_shortcode = ${registrationShortcode}
    ORDER BY created_at DESC
    LIMIT 1
`;

module.exports = getFirst(camelKeys(selectRegistrationRequestByShortcode));
