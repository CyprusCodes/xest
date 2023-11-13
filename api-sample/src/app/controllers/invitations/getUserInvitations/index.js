const fetchUserInvitations = require("~root/actions/invitations/fetchUserInvitations");
const handleAPIError = require("~root/utils/handleAPIError");
const getUserInvitationsSchema = require("./schemas/getUserInvitationsSchema");

const getUserInvitations = async (req, res) => {
  const { userId, email } = req.user;

  try {
    await getUserInvitationsSchema.validate(
      {
        userId,
        email
      },
      {
        abortEarly: false
      }
    );
    const { userInvitations } = await fetchUserInvitations({ email });
    res.status(200).send({
      userInvitations
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getUserInvitations;
