const fetchUserTypes = require("~root/actions/users/fetchUserTypes");
const handleAPIError = require("~root/utils/handleAPIError");

const getUserTypes = async (req, res) => {
  try {
    const { userTypes } = await fetchUserTypes();

    res.status(201).send({
      userTypes
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getUserTypes;
