const handleAPIError = require("~root/utils/handleAPIError");
const removeInvitation = require("~root/actions/users/removeInvitation");
const deleteInvitationSchema = require("./schemas/deleteInvitationSchema");

const deleteInvitation = async (req, res) => {
  const { userId, email } = req.user;
  const { invitationId } = req.params;
  const { shortcode } = req.body;

  try {
    await deleteInvitationSchema.validate(
      {
        userId,
        invitationId,
        shortcode,
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
