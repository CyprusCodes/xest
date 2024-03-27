const createOrganizationUser = require("~root/actions/organizations/createOrganizationUser");
const fetchUserIdByEmail = require("~root/actions/users/fetchUserByEmail");
const handleAPIError = require("~root/utils/handleAPIError");
const postOrganizationUserSchema = require("./schemas/postOrganizationUserSchema");

const postOrganizationUser = async (req, res) => {
  const { userId } = req.user;
  const { email, userRoleId, orgId } = req.body;

  try {
    const { newOrgUserUserId } = await fetchUserIdByEmail({ email });

    await postOrganizationUserSchema.validate(
      {
        orgId,
        userId,
        userRoleId,
        newOrgUserUserId
      },
      {
        abortEarly: false
      }
    );

    const { organizationUserId } = await createOrganizationUser({
      userId: newOrgUserUserId,
      userOrganizationRoleId: userRoleId,
      organizationId: orgId,
      addedBy: userId
    });

    res.send({
      organizationUserId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postOrganizationUser;
