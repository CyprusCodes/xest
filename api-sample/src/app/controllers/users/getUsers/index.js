const fetchUsers = require("~root/actions/users/fetchUsers");
const handleAPIError = require("~root/utils/handleAPIError");

const getUsers = async (req, res) => {
  try {
    const { users } = await fetchUsers();
    res.status(201).send({
      users
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getUsers;
