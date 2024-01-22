const yup = require("yup");
const selectUserByEmail = require("./queries/selectUserByEmail");

const postRegistrationRequestSchema = yup.object().shape({
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

  email: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field has to be less than 50 characters")
    .required()
    .label("Email")
    .typeError("Not a valid Email")
    .test(
      "Does User already exist in platform",
      "This email already registered to platform",

      async function test(email) {
        const userEmail = await selectUserByEmail({
          email
        });

        if (!userEmail) {
          return true;
        }

        return false;
      }
    ),

  password: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(500, "This field has to be less than 500 characters")
    .required()
    .label("Password")
    .typeError("Not a valid Password"),

    companyName: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field has to be less than 50 characters")
    .required()
    .label("Company Name")
    .typeError("Not a valid Company Name"),
});

module.exports = postRegistrationRequestSchema;
