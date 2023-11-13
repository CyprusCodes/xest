const handleAPIError = require("~root/utils/handleAPIError");
const modifyOrganizationInvitation = require("~root/actions/invitations/modifyOrganizationInvitation");
const patchOrganizationInvitationSchema = require("./schemas/patchOrganizationInvitationSchema");

const patchOrganizationInvitation = async (req, res) => {
  const { userId } = req.user;
  const { email, invitationShortcode } = req.body;
  const { orgId } = req.params;

  try {
    await patchOrganizationInvitationSchema.validate(
      {
        userId,
        email,
        orgId,
        invitationShortcode
      },
      {
        abortEarly: false
      }
    );

    const { orgInvitation } = await modifyOrganizationInvitation({
      email,
      invitationShortcode,
      orgId
    });
    res.status(201).send({ orgInvitation });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = patchOrganizationInvitation;
