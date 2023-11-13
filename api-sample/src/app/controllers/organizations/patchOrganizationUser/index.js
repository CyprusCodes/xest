const modifyOrganizationUser = require("~root/actions/organizations/modifyOrganizationUser");
const handleAPIError = require("~root/utils/handleAPIError");
const patchOrganizationUserSchema = require("./schemas/patchOrganizationUserSchema");

const patchOrganizationUser = async (req, res) => {
  const { userId } = req.user;
  const { orgId, userId: orgUserId } = req.params;
  const { userRoleId, enabled } = req.body;

  try {
    await patchOrganizationUserSchema.validate(
      {
        userId,
        orgId,
        orgUserId,
        userRoleId,
        enabled
      },
      {
        abordEarly: false
      }
    );
    const { updatedorgUserId } = await modifyOrganizationUser({
      userId,
      orgId,
      orgUserId,
      userRoleId,
      enabled
    });
    res.status(201).send({ updatedorgUserId });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = patchOrganizationUser;
