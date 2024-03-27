const yup = require("yup");

const postOrganizationSchema = yup.object().shape({
  organizationName: yup
    .string()
    .min(1, "This field must not be empty")
    .max(100, "The number of characters should not be more than 100")
    .label("organization name")
    .typeError("The organization name must be a valid string"),

  userId: yup
    .number()
    .positive()
    .required()
    .label("User Id")
    .typeError("The user id must be a valid number")
});

module.exports = postOrganizationSchema;
