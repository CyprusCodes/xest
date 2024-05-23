const handleAPIError = require("~root/utils/handleAPIError");
const fetchInvitationByShortCode = require("~root/actions/invitations/fetchInvitationByShortCode");
const fetchOrganizationNameById = require("~root/actions/organizations/fetchOrganizationNameById");
const postRegisterWithInvitationSchema = require("./schema/postRegisterWithInvitationSchema");

const getRegisterWithInvitation = async (req, res) => {
  const { invitationShortcode } = req.params;

  try {
    await postRegisterWithInvitationSchema.validate(
      {
        invitationShortcode
      },
      {
        abortEarly: false
      }
    );

    const { invitation } = await fetchInvitationByShortCode({
      invitationShortcode
    });
    const { email, organizationId } = invitation;

    const { organizationName } = await fetchOrganizationNameById({
      organizationId
    });

    res.status(201).send({
      email,
      organizationName
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getRegisterWithInvitation;
