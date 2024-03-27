const yup = require("yup");
const selectEventUser = require("~root/actions/schemaHelpers/queries/selectEventUser/selectEventUser");
const selectOrganizationUser = require("~root/actions/schemaHelpers/queries/selectOrganizationUser/selectOrganizationUser");
const selectSuperAdmin = require("~root/actions/schemaHelpers/queries/selectSuperAdmin/selectSuperAdmin");

const getAllUsersByOrgIdSchema = yup.object().shape({
  orgId: yup
    .number()
    .positive()
    .min(1, "This field can not be empty!")
    .label("Org Id")
    .typeError("The org id must be a valid number"),

  userId: yup
    .number()
    .positive()
    .min(1, "This field can not be empty!")
    .label("User Id")
    .typeError("The user id must be a valid number")
    .test(
      "doesUserBelongToOrganization",
      "The user must belong to the Organization and have the appropriate access.",
      async function test(userId) {
        const { orgId } = this.parent;

        const user = await selectOrganizationUser({
          orgId,
          userId
        });
        if (user) {
          return true;
        }
        const isUserSuperAdmin = await selectSuperAdmin({
          userId
        });
        if (isUserSuperAdmin) {
          return true;
        }
        const eventStaffOrRep = await selectEventUser({ orgId, userId });
        if (eventStaffOrRep) {
          return true;
        }
        return false;
      }
    )
});

module.exports = getAllUsersByOrgIdSchema;
