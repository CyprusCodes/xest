const createOrganizationUser = require("~root/actions/organizations/createOrganizationUser");
const fetchUserInvitation = require("~root/actions/users/fetchUserInvitation");
const modifyUserInvitation = require("~root/actions/users/modifyUserInvitation");
const handleAPIError = require("~root/utils/handleAPIError");
const patchUserInvitationSchema = require("./schemas/patchUserInvitationSchema");

const patchUserInvitation = async (req, res) => {
  const { userId, email } = req.user;
  const { invitationId, shortcode } = req.body;
  try {
    await patchUserInvitationSchema.validate(
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

    const { invitation } = await fetchUserInvitation({
      email,
      invitationId,
      shortcode
    });
    const { userRoleId, organizationId } = invitation;
    const { patchedInvitationId } = await modifyUserInvitation({
      invitationId,
      shortcode
    });
    const { organizationUserId } = await createOrganizationUser({
      userId,
      userRoleId,
      organizationId
    });

    res.status(201).send({
      patchedInvitationId,
      organizationUserId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = patchUserInvitation;
