const yup = require("yup");
const selectSuperAdmin = require("~root/actions/schemaHelpers/queries/selectSuperAdmin/selectSuperAdmin");
const selectOrganizationUser = require("~root/actions/schemaHelpers/queries/selectOrganizationUser/selectOrganizationUser");
const selectUserOrganizationByEmail = require("./queries/selectUserOrganizationByEmail");
const selectUserRole = require("./queries/selectUserRole");
const selectInvitation = require("./queries/selectInvitation");

const postOrganizationInvitationSchema = yup.object().shape({
  comment: yup
    .string()
    .label("comment")
    .typeError("Invalid comment")
    .max(500),

  email: yup
    .string()
    .email()
    .required()
    .label("Email")
    .typeError("Email is invalid.")
    .test(
      "doesEmailExist",
      "User account already exists or Invitation already exist",
      async function test(email) {
        const { orgId, userTypeId } = this.parent;
        const userOrganization = await selectUserOrganizationByEmail({
          email,
          orgId,
          userTypeId
        });
        if (userOrganization) {
          return false;
        }
        const invitation = await selectInvitation({ email, orgId, userTypeId });
        if (invitation) {
          return false;
        }
        return true;
      }
    ),
  userTypeId: yup
    .number()
    .positive()
    .required()
    .label("user role id")
    .typeError("the user role id must be a valid number")
    .test(
      "doesUserRoleIdExist",
      "User role Id does not exists.",
      async function test(userTypeId) {
        const userRole = await selectUserRole({ userTypeId });
        if (userRole) {
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

module.exports = postOrganizationInvitationSchema;
