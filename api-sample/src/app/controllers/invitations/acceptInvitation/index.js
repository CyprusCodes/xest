const handleAPIError = require("~root/utils/handleAPIError");
const fetchInvitationById = require("~root/actions/invitations/fetchInvitationById");
const createOrganizationUser = require("~root/actions/organizations/createOrganizationUser");
const patchInvitationAsAccepted = require("~root/actions/invitations/patchInvitationAsAccepted");
const acceptInvitationSchema = require("./schemas/acceptInvitationSchema");

const acceptInvitation = async (req, res) => {
  const { userId, email } = req.user;
  const { shortCode, invitationId } = req.body;

  try {
    await acceptInvitationSchema.validate(
      { userId, invitationId, shortCode, email },
      {
        abortEarly: false
      }
    );

    const { invitation } = await fetchInvitationById({
      invitationId,
      shortCode
    });

    const { organizationId: orgId, invitedBy, userOrganizationRoleId } = invitation;

    await patchInvitationAsAccepted({
      invitationId,
      shortCode
    });

    const { organizationUserId } = await createOrganizationUser({
      newOrgUserUserId: userId,
      orgId,
      userId: invitedBy,
      userOrganizationRoleId
    });

    res.status(201).send({ organizationUserId });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = acceptInvitation;
