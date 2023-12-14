const yup = require("yup");
const selectUserByEmail = require("./queries/selectUser");

const getUserOrganizationschema = yup.object().shape({
  userId: yup
    .number()
    .label("userId")
    .typeError("userId is invalid.")
    .test(
      "doesUserExists",
      "User account does not exists.",
      async function test(userId) {
        const user = await selectUserByEmail({ userId });

        if (user) {
          return true;
        }

        return false;
      }
    )
});

module.exports = getUserOrganizationschema;
