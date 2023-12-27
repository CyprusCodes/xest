const yup = require("yup");
const selectUserByOrgId = require("~root/actions/organizations/schemaHelpers/queries/selectUserById/selectUserByOrgId");
const selectUserById = require("~root/actions/organizations/schemaHelpers/queries/selectUserById/selectUserById");

const getOrganizationInvitationsSchema = yup.object().shape({
  orgId: yup
    .number()
    .positive()
    .label("OrganizationId")
    .typeError("Organization Id must be valid."),
  userId: yup
    .number()
    .positive()
    .label("userId")
    .typeError("The userId must be a number")
    .test(
      "UserMustExistAndBelongToThatOrganization",
      "The user does not exist or does not belong to that organization",
      async function test(userId) {
        const { orgId } = this.parent;

        const user = await selectUserById({ userId });

        if (!user) {
          return false;
        }

        const orgUser = await selectUserByOrgId({ userId, orgId });

        if (!orgUser) {
          return false;
        }

        return true;
      }
    )
});

module.exports = getOrganizationInvitationsSchema;
