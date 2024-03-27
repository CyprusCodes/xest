const yup = require("yup");
const selectSuperAdmin = require("~root/actions/schemaHelpers/queries/selectSuperAdmin/selectSuperAdmin");
const selectOrganizationUser = require("~root/actions/schemaHelpers/queries/selectOrganizationUser/selectOrganizationUser");
const selectUserRoleIfInUserRoles = require("./queries/selectUserRoleIfInUserRoles");
const selectOrgUserByUserId = require("./queries/selectOrgUserByUserId");

const postOrganizationUserSchema = yup.object().shape({
  newOrgUserUserId: yup
    .number()
    .positive()
    .min(1, "This field can not be empty!")
    .label("New organization user user_id")
    .typeError("The new organization user user_id must be a valid number")
    .test(
      "doesOrganizationUserExist",
      "User should exist and not belong to the given organization.",
      async function test(newOrgUserUserId) {
        const { orgId } = this.parent;

        const user = await selectOrgUserByUserId({
          newOrgUserUserId,
          orgId
        });
        if (user) {
          return false;
        }

        return true;
      }
    ),

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
  userRoleId: yup
    .number()
    .positive()
    .min(1, "This field can noy be empty!")
    .label("user role id")
    .typeError("The user role id must be a valid number")
    .test(
      "UserRoleIdbelongToUserRoles",
      "The user role id should be in the user roles table.",
      async function test(userRoleId) {
        const userRole = await selectUserRoleIfInUserRoles({ userRoleId });
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
    .typeError("Organization Id must be a number")
});

module.exports = postOrganizationUserSchema;
