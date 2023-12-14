const fetchRequestByShortcode = require("~root/actions/users/fetchRequestByShortcode");
const handleAPIError = require("~root/utils/handleAPIError");

const getRequestByShortcode = async (req, res) => {
  const { shortcode } = req.params;
  try {
    await getRequestByShortcode.validate(
      {
        shortcode
      },
      {
        abortEarly: false
      }
    );
    const { request } = await fetchRequestByShortcode({ shortcode });
    res.status(201).send({
      request
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getRequestByShortcode;
