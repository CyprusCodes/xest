const yup = require("yup");
const selectOrganizationUser = require("~root/actions/schemaHelpers/queries/selectOrganizationUser/selectOrganizationUser");
const selectSuperAdmin = require("~root/actions/schemaHelpers/queries/selectSuperAdmin/selectSuperAdmin");
const selectOrgUserById = require("./queries/selectOrgUserById");

const deleteOrganizationUserSchema = yup.object().shape({
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
    .required()
    .label("OrgUser to be deleted")
    .typeError("the organization User Id must be a valid number")
    .test(
      "doesTheUserBelongToTheOrganization",
      "check if the organization user exist and belong to the organization",
      async function test(orgUserId) {
        const { orgId } = this.parent;

        const orgUser = await selectOrgUserById({ orgId, orgUserId });

        if (orgUser) {
          return true;
        }
        return false;
      }
    )
});

module.exports = deleteOrganizationUserSchema;
