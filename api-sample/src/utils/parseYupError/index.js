const { ValidationError } = require("yup");

const parseYupError = err => {
  if (err instanceof ValidationError) {
    const isSingleError = err.inner.length === 0 && err.path && err.message;

    if (isSingleError) {
      return [
        {
          path: err.path,
          message: err.message
        }
      ];
    }

    return err.inner.map(({ path, message }) => {
      return { path, message };
    });
  }
  return {};
};

module.exports = parseYupError;
