const yup = require("yup");
const selectUser = require("./queries/selectUser");

const getOrganizationsByUserIdSchema = yup.object().shape({
  userId: yup
    .number()
    .positive()
    .min(1, "This field can not be empty!")
    .label("User Id")
    .typeError("The user id must be a valid number")
    .test("doesUserExist", "The user must exist", async function test(userId) {
      const user = await selectUser({
        userId
      });
      if (user) {
        return true;
      }

      return false;
    })
});

module.exports = getOrganizationsByUserIdSchema;
