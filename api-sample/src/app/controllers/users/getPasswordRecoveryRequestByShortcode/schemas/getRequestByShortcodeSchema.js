const yup = require("yup");
const selectRequestByShortcode = require("./queries/selectRequestByShortcode");

const getRequestByShortcode = yup.object().shape({
  shortcode: yup
    .string()
    .label("Shortcode")
    .typeError("The shortcode must be valid.")
    .test("RequestMustExist", "The request doesnot exist", async function test(
      shortcode
    ) {
      const isShortcodeExit = await selectRequestByShortcode({ shortcode });
      if (isShortcodeExit) {
        return true;
      }
      return false;
    })
});
module.exports = getRequestByShortcode;
