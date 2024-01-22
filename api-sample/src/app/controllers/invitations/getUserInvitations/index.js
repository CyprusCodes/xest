const fetchUserInvitations = require("~root/actions/users/fetchUserInvitations");
const handleAPIError = require("~root/utils/handleAPIError");
const getUserInvitationSchema = require("./schemas/getUserInvitationsSchema");

const getUserInvitations = async (req, res) => {
  const { email } = req.user;
  try {
    await getUserInvitationSchema.validate(
      {
        email
      },
      {
        abortEarly: false
      }
    );
    const { invitations } = await fetchUserInvitations({ email });
    res.status(201).send({
      invitations
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getUserInvitations;
