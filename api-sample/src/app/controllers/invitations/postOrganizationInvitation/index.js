const { nanoid } = require("nanoid");
const handleAPIError = require("~root/utils/handleAPIError");
const createOrganizationInvitation = require("~root/actions/invitations/createOrganizationInvitation");
const sendEmail = require("~root/lib/services/emails/sendEmail");
const postOrganizationInvitationSchema = require("./schemas/postOrganizationInvitationSchema");
const selectUserFullNameById = require("./queries/selectUserFullNameById");
const selectOrganizationNameById = require("./queries/selectOrganizationNameById");
const selectUserRoleNameById = require("./queries/selectUserRoleNameById");

const postOrganizationInvitation = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;
  const { email, userRoleId, comment } = req.body;
  const invitationShortcode = nanoid(10);
  try {
    await postOrganizationInvitationSchema.validate(
      {
        userId,
        orgId,
        email,
        userRoleId,
        comment
      },
      {
        abortEarly: false
      }
    );

    const { firstName, lastName } = await selectUserFullNameById({ userId });
    const { organizationName } = await selectOrganizationNameById({ orgId });
    const { userRole } = await selectUserRoleNameById({ userRoleId });
    const sender = `${firstName} ${lastName}`;

    let messageTitle = "";
    let newRole;

    if (comment) {
      messageTitle = `Below is a message from ${sender} :`;
    }

    if (userRole === "representative") {
      newRole = "Rep";
    }
    if (userRole === "organization admin") {
      newRole = "Company Admin";
    }
    if (userRole === "check-in staff") {
      newRole = "Check-in Staff";
    }

    const emailPayload = {
      to: email,
      template: "user-organization-invitation",
      version: "0.0.1",
      metadata: {
        sender,
        userRole: newRole,
        organizationName,
        messageTitle,
        senderMessage: comment,
        notificationsPageUrl: `${process.env.APP_BASE_URL}/authentication/register?email=${email}`
      }
    };
    const { newInvitationId } = await createOrganizationInvitation({
      userId,
      orgId,
      email,
      userRoleId,
      comment,
      invitationShortcode
    });

    await sendEmail(emailPayload);

    res.send({
      newInvitationId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postOrganizationInvitation;
