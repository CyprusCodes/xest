const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.XEST_GPT_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = openai;
