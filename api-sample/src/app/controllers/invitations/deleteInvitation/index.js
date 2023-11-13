const removeInvitation = require("~root/actions/invitations/removeInvitation");
const handleAPIError = require("~root/utils/handleAPIError");
const deleteInvitationSchema = require("./schemas/deleteInvitationSchema");

const deleteInvitation = async (req, res) => {
  const { userId, email } = req.user;
  const { invitationId } = req.params;
  const { shortCode } = req.body;

  try {
    await deleteInvitationSchema.validate(
      {
        userId,
        invitationId,
        shortCode,
        email
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

module.exports = deleteInvitation;
