const { v4: uuidv4 } = require('uuid');
const handleAPIError = require("~root/utils/handleAPIError");
const createOrganizationInvitation = require("~root/actions/users/createOrganizationInvitation");
const sendEmail = require("~root/lib/services/emails/sendEmail");
const postOrganizationInvitationSchema = require("./schemas/postOrganizationInvitationSchema");
const selectUserFullNameById = require("./queries/selectUserFullNameById");
const selectOrganizationNameById = require("./queries/selectOrganizationNameById");
const selectUserRoleNameById = require("./queries/selectUserRoleNameById");

const postOrganizationInvitation = async (req, res) => {
  const { userId } = req.user;
  const { email, userOrganizationRoleId, comment, orgId } = req.body;
  const invitationShortcode = uuidv4();
console.log("postOrganizationInvitation", invitationShortcode);
  try {
    await postOrganizationInvitationSchema.validate(
      {
        userId,
        orgId,
        email,
        userOrganizationRoleId,
        comment
      },
      {
        abortEarly: false
      }
    );

    const { firstName, lastName } = await selectUserFullNameById({ userId });
    const { organizationName } = await selectOrganizationNameById({ orgId });
    const { userRole } = await selectUserRoleNameById({ userOrganizationRoleId });
    const sender = `${firstName} ${lastName}`;

    let messageTitle = "";
    let newRole;

    if (comment) {
      messageTitle = `Below is a message from ${sender} :`;
    }
    if (userRole === "Admin") {
      newRole = "Company Admin";
    }
    if (userRole === "Member") {
      newRole = "Member";
    }

    const { newInvitationId } = await createOrganizationInvitation({
      userId,
      orgId,
      email,
      userOrganizationRoleId,
      comment,
      invitationShortcode
    });

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
        notificationsPageUrl: `${process.env.APP_BASE_URL}`,
      }
    };
    await sendEmail(emailPayload);

    res.send({
      newInvitationId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postOrganizationInvitation;
