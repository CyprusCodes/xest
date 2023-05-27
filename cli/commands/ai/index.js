const chalk = require("chalk");
const findProjectRoot = require("../../utils/findProjectRoot");
const { getInitialPrompt } = require("./prompts/index");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.XEST_GPT_KEY,
});
const openai = new OpenAIApi(configuration);

const ai = async () => {
  const projectDetails = findProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a Xest project directory. Please check your current path directory.`
    );
    return;
  }

  console.log("Welcome to XestGPT\n");

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: getInitialPrompt() },
      {
        role: "user",
        content: "do we have an api endpoint that takes payments",
        // content: "do we have an endpoint for managing payments",
      },
      /*
      {
        role: "assistant",
        content: "I'm not sure, would you like me to check for you?",
      },
      {
        role: "user",
        content: "yes",
      },
      {
        role: 'assistant',
        content: 'To check if there is an API endpoint that takes payments, I need to know the list of API endpoints. Please run the command `getListOfApiEndpoints` and provide me with the output.'
      },
      {
        role: "system",
        content: `getListOfApiEndpoints output 
      getListOfApiEndpoints
      GET /api/v1/carriers-services
      POST /api/v1/shipments
      POST /api/v1/tracking`,
      },
      */
    ],
    max_tokens: 100,
    temperature: 0,
  });

  const { prompt_tokens, completion_tokens, total_tokens } =
    completion.data.usage;
  console.log({ prompt_tokens, completion_tokens, total_tokens });
  console.log(completion.data.choices);
};

module.exports = {
  ai,
};
