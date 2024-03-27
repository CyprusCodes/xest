const yup = require("yup");
const selectUser = require("./queries/selectuser");

const postOrganizationSchema = yup.object().shape({
  userId: yup
    .number()
    .required("The user Id is required")
    .label("User Id")
    .typeError("The User Id must be a valid number")
    .test("DoesUserExist", "The User does not exist", async function test(
      userId
    ) {
      const isUser = await selectUser({
        userId
      });
      if (isUser) {
        return true;
      }

      return false;
    }),
  organizationName: yup
    .string()
    .required("The Organization Name is a required field")
    .label("Name")
    .typeError("Name must be a string.")
});
module.exports = postOrganizationSchema;
