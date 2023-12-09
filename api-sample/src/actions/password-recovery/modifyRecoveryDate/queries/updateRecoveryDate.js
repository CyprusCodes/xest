const { submitQuery, getInsertId } = require("~root/lib/database");

const updateRecoveryDate = ({ email }) => submitQuery`

  UPDATE password_recovery_requests
  SET recovered_at = CURRENT_TIMESTAMP
  WHERE requested_email = ${email};

  `;

module.exports = getInsertId(updateRecoveryDate);
