const selectRequestByShortcode = require("./queries/selectRequestByShortcode");

const fetchRequestByShortcode = async ({ shortcode }) => {
  const request = await selectRequestByShortcode({ shortcode });

  return { request };
};

module.exports = fetchRequestByShortcode;
