const yup = require("yup");
const selectUserById = require("./queries/selectUserById");
const selectUserByInvitationId = require("./queries/selectUserByInvitationId");

const patchUserInvitationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .label("Email")
    .typeError("Email is invalid."),
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
        const { email } = this.parent;
        const userID = await selectUserById({
          userId,
          email
        });
        if (userID) {
          return true;
        }

        return false;
      }
    ),
  invitationId: yup
    .number()
    .positive()
    .label("Invitation Id")
    .typeError("The invitation id must be valid number.")
    .test(
      "doesInvitationIdExist",
      "The invitation must be exist in the organization",
      async function test(invitationId) {
        const { shortcode } = this.parent;
        const hasInvitationId = await selectUserByInvitationId({
          invitationId,
          shortcode
        });
        if (hasInvitationId) {
          return true;
        }

        return false;
      }
    ),
  shortcode: yup
    .string()
    .label("Shortcode")
    .typeError("The shortcode must be string.")
});

module.exports = patchUserInvitationSchema;
