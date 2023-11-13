const yup = require("yup");
const selectSuperAdmin = require("~root/actions/schemaHelpers/queries/selectSuperAdmin/selectSuperAdmin");
const selectOrganizationUser = require("~root/actions/schemaHelpers/queries/selectOrganizationUser/selectOrganizationUser");
const selectOrgUserByUserIdAndOrgId = require("./queries/selectOrgUserByUserIdAndOrgId");
const selectUserRole = require("./queries/selectUserRole");

const patchOrganizationUserSchema = yup.object().shape({
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
    ),

  orgUserId: yup
    .number()
    .positive()
    .label("Org User Id")
    .typeError("The orgUserId must be a valid number")
    .test(
      "orgUserIdMustExist",
      "The orgUserId must exist in the user_organization table",
      async function test(orgUserId) {
        const { orgId } = this.parent;
        const orgUser = await selectOrgUserByUserIdAndOrgId({
          orgUserId,
          orgId
        });
        if (orgUser) {
          return true;
        }
        return false;
      }
    ),

  userRoleId: yup
    .number()
    .positive()
    .label("userRoleId")
    .typeError("The eventRoleId must a valid number")
    .test(
      "DoesuserRoleIdExists",
      "The userRoleId must exist in the user_roles table",
      async function test(userRoleId) {
        const userRole = await selectUserRole({ userRoleId });
        if (userRole) {
          return true;
        }
        return false;
      }
    ),

  enabled: yup
    .boolean()
    .label("enabled")
    .typeError("enabled must be a boolean")
});

module.exports = patchOrganizationUserSchema;
