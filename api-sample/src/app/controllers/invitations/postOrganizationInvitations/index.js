// const { nanoid } = require("nanoid");
const handleAPIError = require("~root/utils/handleAPIError");
const createOrganizationInvitation = require("~root/actions/invitations/createOrganizationInvitation");
const asyncParallel = require("~root/utils/asyncParallel");
const postOrganizationInvitationsSchema = require("./schemas/postOrganizationInvitationsSchema");

const postOrganizationInvitations = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;
  const { allInvitedUsers } = req.body;
  const invitationShortcode = 567890123;
  // nanoid(10);

  try {
    const invitedUsers = [];
    await asyncParallel(allInvitedUsers, async newUser => {
      const { email, userRoleId } = newUser;

      await postOrganizationInvitationsSchema.validate(
        {
          userId,
          orgId,
          email,
          userRoleId
        },
        {
          abortEarly: false
        }
      );

      const { newInvitationId } = await createOrganizationInvitation({
        userId,
        orgId,
        email,
        userRoleId,
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
