const yup = require("yup");

const extendYupSchema = (targetSchema, extensions) => {
  return targetSchema.clone().concat(yup.object().shape(extensions));
};

module.exports = extendYupSchema;
