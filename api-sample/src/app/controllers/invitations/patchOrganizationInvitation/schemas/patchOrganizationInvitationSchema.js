const yup = require("yup");
const selectSuperAdmin = require("~root/actions/schemaHelpers/queries/selectSuperAdmin/selectSuperAdmin");
const selectOrganizationUser = require("~root/actions/schemaHelpers/queries/selectOrganizationUser/selectOrganizationUser");
const selectUserOrganizationByEmail = require("./queries/selectUserOrganizationByEmail");
const selectInvitation = require("./queries/selectInvitation");

const patchOrganizationInvitationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .label("Email")
    .typeError("Email is invalid.")
    .test("doesEmailExist", "User account already exists.", async function test(
      email
    ) {
      const { orgId } = this.parent;

      const userOrganization = await selectUserOrganizationByEmail({
        email,
        orgId
      });

      if (userOrganization) {
        return false;
      }

      return true;
    }),

  invitationShortcode: yup
    .string()
    .required()
    .label("invitation shortcode")
    .typeError("the invitation shortcode is not a valid string")
    .test(
      "doesInvitationShortcodeExist",
      "Invitation shortcode does not exists.",
      async function test(invitationShortcode) {
        const invitation = await selectInvitation({ invitationShortcode });

        if (invitation) {
          return true;
        }
        return false;
      }
    ),

  orgId: yup
    .number()
    .required()
    .label("Organization ID")
    .typeError("Organization Id must be a number"),

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
    )
});

module.exports = patchOrganizationInvitationSchema;
