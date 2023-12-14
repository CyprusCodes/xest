const yup = require("yup");
const selectEmail = require("./queries/selectEmail");
const selectPassword = require("./queries/selectPassword");

const putPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .email()
    .label("Email")
    .typeError("Email must be valid.")
    .test("doesEmailExist", "Email must exist", function test(email) {
      if (email !== this.parent.requestedEmail) {
        return false;
      }
      return selectEmail({
        email
      }).then(emailFound => {
        if (emailFound) {
          return true;
        }
        return false;
      });
    }),
  password: yup
    .string()
    .required()
    .min(8)
    .label("Password")
    .typeError("Password must be valid.")
    .test("doesPasswordsMatch", "Passwords should match.", function test(
      password
    ) {
      const { confirmPassword } = this.parent;
      if (password !== confirmPassword) {
        return false;
      }
      return true;
    })
    .test(
      "doesPasswordsNotMatchWithThePreviousPassword",
      "Password shouldn't be same as your previous password.",
      function test(password) {
        const { email } = this.parent;
        return selectPassword({
          email,
          password
        }).then(isPasswordTheSameAsBefore => {
          if (!isPasswordTheSameAsBefore) {
            return true;
          }
          return false;
        });
      }
    )
});

module.exports = putPasswordSchema;
