const removeInvitation = require("~root/actions/invitations/removeInvitation");
const handleAPIError = require("~root/utils/handleAPIError");
const deleteInvitationSchema = require("./schemas/deleteInvitationSchema");

const deleteInvitatioByOrgUser = async (req, res) => {
  const { userId } = req.user;
  const { invitationId, orgId } = req.params;

  try {
    await deleteInvitationSchema.validate(
      {
        orgId,
        userId,
        invitationId
      },
      {
        abortEarly: false
      }
    );
    const { invitation } = await removeInvitation({
      invitationId
    });
    res.status(204).send({
      invitation
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = deleteInvitatioByOrgUser;
