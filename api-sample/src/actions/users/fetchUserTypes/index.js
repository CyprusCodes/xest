const selectUserTypes = require("./queries/selectUserTypes");

const fetchUserTypes = async () => {
  const userTypes = await selectUserTypes();

  return { userTypes };
};

module.exports = fetchUserTypes;
