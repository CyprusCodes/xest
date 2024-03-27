const handleAPIError = require("~root/utils/handleAPIError");
const removeUserOrganizationInvitations = require("~root/actions/userOrganizationInvitations/removeUserOrganizationInvitations");
const newDeleteUserOrganizationInvitationsSchema = require("./schema/newDeleteUserOrganizationInvitationsSchema");

const deleteUserOrganizationInvitations = async (req, res) => {
  const { userOrganizationInvitationId, orgId } = req.params;

  try {
    await newDeleteUserOrganizationInvitationsSchema.validate(
      { userOrganizationInvitationId },
      { abortEarly: false }
    );
    await removeUserOrganizationInvitations({
      userOrganizationInvitationId,
      orgId
    });

    res.status(204).send({ success: true });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = deleteUserOrganizationInvitations;
