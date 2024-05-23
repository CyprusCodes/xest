const { v4: uuidv4 } = require("uuid");
const handleAPIError = require("~root/utils/handleAPIError");
const createOrganizationInvitation = require("~root/actions/invitations/createOrganizationInvitation");
const asyncParallel = require("~root/utils/asyncParallel");
const postOrganizationInvitationsSchema = require("./schemas/postOrganizationInvitationsSchema");

const postOrganizationInvitations = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;
  const { allInvitedUsers } = req.body;
  const invitationShortcode = uuidv4();

  try {
    const invitedUsers = [];
    await asyncParallel(allInvitedUsers, async newUser => {
      const { email, userOrganizationRoleId } = newUser;

      await postOrganizationInvitationsSchema.validate(
        {
          userId,
          orgId,
          email,
          userOrganizationRoleId
        },
        {
          abortEarly: false
        }
      );

      const { newInvitationId } = await createOrganizationInvitation({
        userId,
        orgId,
        email,
        userOrganizationRoleId,
        invitationShortcode
      });
      invitedUsers.push(newInvitationId);
    });

    res.send({
      invitedUsers
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postOrganizationInvitations;
