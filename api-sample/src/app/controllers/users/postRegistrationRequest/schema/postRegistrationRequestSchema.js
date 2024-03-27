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
    .email()
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
    .min(8, "Password must be at least 8 characters long!")
    .max(500, "This field has to be less than 500 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required()
    .label("Password")
    .typeError("Not a valid Password"),

  organizationName: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field has to be less than 50 characters")
    .required()
    .label("Company Name")
    .typeError("Not a valid Company Name")
});

module.exports = postRegistrationRequestSchema;
