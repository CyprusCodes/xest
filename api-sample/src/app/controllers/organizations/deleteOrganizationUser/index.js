const handleAPIError = require("~root/utils/handleAPIError");
const removeOrganizationUser = require("~root/actions/organizations/removeOrganizationUser");
const deleteOrganizationUserSchema = require("./schemas/deleteOrganizationUserSchema");

const deleteOrganizationUser = async (req, res) => {
  const { userId } = req.user;
  const { orgId, orgUserId } = req.body;

  try {
    await deleteOrganizationUserSchema.validate(
      {
        orgId,
        userId,
        orgUserId
      },
      {
        abortEarly: false
      }
    );

    const { deletedOrgUser } = await removeOrganizationUser({
      orgUserId,
      orgId
    });

    res.status(204).send({ deletedOrgUser });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = deleteOrganizationUser;
