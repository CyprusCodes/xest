const yup = require("yup");
const selectUserById = require("./queries/selectUserById");

const getUserOrganizationsSchema = yup.object().shape({
  userId: yup
    .number()
    .label("userId")
    .typeError("userId is invalid.")
    .test(
      "doesUserExists",
      "User account does not exists.",
      async function test(userId) {
        const user = await selectUserById({ userId });
        if (user) {
          return true;
        }
        return false;
      }
    )
});

module.exports = getUserOrganizationsSchema;
