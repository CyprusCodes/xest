const yup = require("yup");
// eslint-disable-next-line import/order
const selectInvitation = require("./queries/selectInvitation");
const selectSuperAdmin = require("~root/actions/schemaHelpers/queries/selectSuperAdmin/selectSuperAdmin");
const selectOrganizationUser = require("~root/actions/schemaHelpers/queries/selectOrganizationUser/selectOrganizationUser");

const deleteInvitationSchema = yup.object().shape({
  userId: yup
    .number()
    .positive()
    .min(1, "This field can not be empty!")
    .label("User Id")
    .typeError("The user id must be a valid number")
    .test(
      "doesUserBelongToOrganization",
      "The user must belong to the Organization and have the appropriate access (organization admin or event manager) or be a superAdmin",
      async function test(userId) {
        const { orgId } = this.parent;

        const isUserSuperAdmin = await selectSuperAdmin({
          userId
        });
        if (isUserSuperAdmin) {
          return true;
        }

        const user = await selectOrganizationUser({
          orgId,
          userId
        });
        if (user) {
          return true;
        }

        return false;
      }
    ),

  invitationId: yup
    .number()
    .positive()
    .label("invitaionId")
    .typeError("The invitation id must be a valid id")
    .test(
      "ShortCodeMustExist",
      "The Invitation ShortCode must belong to an invitation with the same Invitation Id & the Invitation must belong to the user",
      async function test(shortCode) {
        const { invitationId, email } = this.parent;

        const invitation = await selectInvitation({
          shortCode,
          invitationId,
          email
        });
        if (invitation) {
          return true;
        }

        return false;
      }
    )
});

module.exports = deleteInvitationSchema;
