/* eslint-disable func-names */
const yup = require("yup");

// https://github.com/jquense/yup/issues/298#issuecomment-508346424
// Helper to validate the numbers that can be empty string
const EmptyNumber = (typeErrorMessage = "Please enter a valid number") => {
  return yup
    .number()
    .transform(function(value, originalValue) {
      if (this.isType(value)) return value;
      if (!originalValue || !originalValue.trim()) {
        return null;
      }
      // we return the invalid original value
      return originalValue;
    })
    .nullable(true)
    .typeError(typeErrorMessage);
};

module.exports = EmptyNumber;
