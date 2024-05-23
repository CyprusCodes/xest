const yup = require("yup");
const selectEmail = require("./queries/selectEmail");

const postRecoveryRequestSchema = yup.object().shape({
  requestedEmail: yup
    .string()
    .required()
    .email()
    .label("Email")
    .typeError("Email must be valid.")
    .test("doesEmailExist", "Email must exist.", function test(requestedEmail) {
      return selectEmail({
        requestedEmail
      }).then(email => {
        if (email) {
          return true;
        }
        return false;
      });
    })
});

module.exports = postRecoveryRequestSchema;
