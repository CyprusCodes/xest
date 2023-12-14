const { submitQuery, getInsertId } = require("~root/lib/database");

const insertRecoveryRequest = ({ requestedEmail, URLshortcode }) => submitQuery`
    INSERT INTO 
      password_recovery_requests (        
      requested_email,
      shortcode,
      expiry_date
    )VALUES (
      ${requestedEmail},
      ${URLshortcode},
      TIMESTAMPADD(HOUR, 8, CURRENT_TIMESTAMP)
    )
`;

module.exports = getInsertId(insertRecoveryRequest);
