const handleAPIError = require("~root/utils/handleAPIError");
const fetchOrganizationUsers = require("~root/actions/organizations/fetchOrganizationUsers");
const getOrganizationUsersSchema = require("./schemas/getOrganizationUsersSchema");

const getOrganizationUsers = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;
  try {
    await getOrganizationUsersSchema.validate(
      {
        orgId,
        userId
      },
      {
        abortEarly: false
      }
    );
    const { organizationUsers } = await fetchOrganizationUsers({ orgId });

    res.status(200).send({
      organizationUsers
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getOrganizationUsers;
