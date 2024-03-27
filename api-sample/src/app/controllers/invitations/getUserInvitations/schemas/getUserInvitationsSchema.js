const yup = require("yup");
const selectUser = require("./queries/selectUser");

const getUserInvitationsSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .label("email")
    .typeError("The email is invalid"),

  userId: yup
    .number()
    .positive()
    .min(1, "This field can not be empty!")
    .label("User Id")
    .typeError("The user id must be a valid number")
    .test("doesUserExist", "The user must exist", async function test(userId) {
      const { email } = this.parent;

      const user = await selectUser({
        userId,
        email
      });
      if (user) {
        return true;
      }

      return false;
    })
});

module.exports = getUserInvitationsSchema;
