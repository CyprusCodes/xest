const yup = require("yup");
const selectInvitationByShortCode = require("./queries/selectInvitationByShortCode");

const postRegisterWithInvitationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field has to be less than 50 characters")
    .required()
    .label("First Name")
    .typeError("Not a valid First Name"),

  lastName: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field has to be less than 50 characters")
    .required()
    .label("Last Name")
    .typeError("Not a valid Last Name"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long!")
    .max(500, "This field has to be less than 500 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required()
    .label("Password")
    .typeError("Not a valid Password"),

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
