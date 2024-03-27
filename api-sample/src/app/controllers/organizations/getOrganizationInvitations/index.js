const fetchOrganizationInvitations = require("~root/actions/organizations/fetchOrganizationInvitations");
const handleAPIError = require("~root/utils/handleAPIError");
const getOrganizationInvitationsSchema = require("./schemas/getOrganizationInvitationsSchema");

const getOrganizationInvitations = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;

  try {
    await getOrganizationInvitationsSchema.validate(
      {
        orgId,
        userId
      },
      {
        abortEarly: false
      }
    );
    const { invitations } = await fetchOrganizationInvitations({ orgId });

    res.status(201).send({
      invitations
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getOrganizationInvitations;
