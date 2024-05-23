const yup = require("yup");
const selectUserByEmail = require("./queries/selectUserByEmail");

const getOrganizationsByEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .label("email")
    .typeError("Not a valid Email")
    .test(
      "DoesEmailExist",
      "The Email address does not exist for any user",
      async function test(email) {
        const user = await selectUserByEmail({
          email
        });
        if (user) {
          return true;
        }

        return false;
      }
    )
});

module.exports = getOrganizationsByEmailSchema;
