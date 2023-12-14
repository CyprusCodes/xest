const handleAPIError = require("~root/utils/handleAPIError");
const removeOrganizationInvitation = require("~root/actions/organizations/removeOrganizationInvitation");
const deleteOrganizationInvitationSchema = require("./schemas/deleteOrganizationInvitationSchema");

const deleteOrganizationInvitation = async (req, res) => {
  const { userId } = req.user;
  const { orgId, invitationId } = req.params;
  const { shortcode } = req.body;

  try {
    await deleteOrganizationInvitationSchema.validate(
      {
        userId,
        invitationId,
        shortcode,
        orgId
      },
      {
        abortEarly: false
      }
    );
    const { invitation } = await removeOrganizationInvitation({
      invitationId
    });
    res.status(204).send({
      invitation
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = deleteOrganizationInvitation;
