const handleAPIError = require("~root/utils/handleAPIError");
const fetchUserOrganizations = require("~root/actions/users/fetchUserOrganizations");
const getUserOrganizationsSchema = require("./schemas/getUserOrganizationsSchema");

const getUserOrganizations = async (req, res) => {
  const { userId } = req.user;
  try {
    await getUserOrganizationsSchema.validate(
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
