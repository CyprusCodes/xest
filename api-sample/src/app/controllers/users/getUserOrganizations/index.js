const handleAPIError = require("~root/utils/handleAPIError");
const fetchUserOrganizations = require("~root/actions/users/fetchUserOrganizations");
const getUserOrganizationschema = require("./schemas/getUserOrganizationschema");

const getUserOrganizations = async (req, res) => {
  const { userId } = req.user;
  try {
    await getUserOrganizationschema.validate(
      {
        userId
      },
      {
        abortEarly: false
      }
    );
    const { organizations } = await fetchUserOrganizations({ userId });
    res.status(201).send({
      organizations
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getUserOrganizations;
