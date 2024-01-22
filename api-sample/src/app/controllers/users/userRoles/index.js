const fetchUserRoles = require("~root/actions/users/fetchUserRoles");
const handleAPIError = require("~root/utils/handleAPIError");

const getUserRoles = async (req, res) => {
  try {
    const { userRoles } = await fetchUserRoles();

    res.status(201).send({
      userRoles
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getUserRoles;
