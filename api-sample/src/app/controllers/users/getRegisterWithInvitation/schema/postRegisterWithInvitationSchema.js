const yup = require("yup");
const selectInvitationByShortCode = require("./queries/selectInvitationByShortCode");

const postRegisterWithInvitationSchema = yup.object().shape({
  invitationShortcode: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(150, "This field has to be less than 150 characters")
    .required()
    .label("Invitation Shortcode")
    .typeError("Not a valid Invitation Shortcode")
    .test(
      "ShortCodeMustExist",
      "The Invitation ShortCode must belong to an email",
      async function test(invitationShortcode) {
        const { email } = this.parent;
        const invitation = await selectInvitationByShortCode({
          invitationShortcode,
          email
        });
        if (invitation) {
          return true;
        }
        return false;
      }
    )
});

module.exports = postRegisterWithInvitationSchema;
