const chalk = require("chalk");
const inquirer = require("inquirer");
const findProjectRoot = require("../../utils/findProjectRoot");
const { getInitialPrompt } = require("./prompts/index");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.XEST_GPT_KEY,
});
const openai = new OpenAIApi(configuration);

const getTotalComputationCost = ({
  totalPromptToken = 0,
  totalCompletionTokens = 0,
}) => {
  // https://openai.com/pricing
  // gpt-3.5-turbo -> $0.002 / 1K tokens
  const gptTurboCost = 0.002;

  const cost =
    ((totalPromptToken + totalCompletionTokens) / 1000) * gptTurboCost;
  console.log({ totalPromptToken, totalCompletionTokens });
  console.log(`Total cost: ${cost}`);
  return cost;
};

// limit ai usage so we don't hit out quota with a single query
const MAX_COST = 0.001;

const commandsList = `
getListOfDatabaseTables
getListOfCodebaseFiles
readFileContents <pathToTheFile>
getListOfApiEndpoints
`;

const ai = async () => {
  const projectDetails = findProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a Xest project directory. Please check your current path directory.`
    );
    return;
  }

  console.log("Welcome to XestGPT\n");

  let answered = false;
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;
  let messages = [
    { role: "system", content: getInitialPrompt({ commandsList }) },
  ];
  const answer = await inquirer.prompt({
    type: "input",
    name: "qry",
    message: "Welcome to XestGPT. What would you like help with today?\n",
  });
  messages.push({ role: "user", content: answer.qry });

  while (
    !answered &&
    getTotalComputationCost({ totalPromptTokens, totalCompletionTokens }) <
      0.001
  ) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 100,
      temperature: 0,
    });

    const { prompt_tokens, completion_tokens, total_tokens } =
      completion.data.usage;
    totalPromptTokens += prompt_tokens;
    totalCompletionTokens += completion_tokens;

    answered = true;
    console.log({ prompt_tokens, completion_tokens, total_tokens });
    console.log(completion.data.choices);
  }
};

module.exports = {
  ai,
};
