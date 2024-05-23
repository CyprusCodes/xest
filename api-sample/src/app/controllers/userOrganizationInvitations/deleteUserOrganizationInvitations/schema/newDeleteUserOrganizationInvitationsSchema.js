const yup = require("yup");
const selectUserOrganizationInvitationsById = require("./queries/selectUserOrganizationInvitationsById");

const newDeleteUserOrganizationInvitationsSchema = yup.object().shape({
  userOrganizationInvitationId: yup
    .number()
    .integer()
    .required()
    .label("userOrganizationInvitationId")
    .typeError("The userOrganizationInvitationId field must be a number")
    .test(
      "doesExist",
      "The userOrganizationInvitationId field must be a valid userOrganizationInvitationId",
      async function test(userOrganizationInvitationId) {
        if (!userOrganizationInvitationId) {
          return false;
        }

        const userOrganizationInvitationIdCount = await selectUserOrganizationInvitationsById(
          { userOrganizationInvitationId }
        );
        if (userOrganizationInvitationIdCount === 0) {
          return false;
        }
        return true;
      }
    )
});

module.exports = newDeleteUserOrganizationInvitationsSchema;
