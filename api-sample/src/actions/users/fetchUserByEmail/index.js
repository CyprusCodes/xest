const selectUserIdByEmail = require("./queries/selectUserIdByEmail");

const fetchUserIdByEmail = async ({ email }) => {
  const newOrgUserUserId = await selectUserIdByEmail({
    email
  });

  return { newOrgUserUserId };
};

module.exports = fetchUserIdByEmail;
