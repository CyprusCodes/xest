const openAI = require("openai");

const openai = new openAI({
  apiKey: process.env.XEST_GPT_KEY,
});

module.exports = openai;
