const chalk = require("chalk");
const inquirer = require("inquirer");
const findProjectRoot = require("../../utils/findProjectRoot");
const { getInitialPrompt, getAvailableCommandDescriptions } = require("./prompts/index");
const { Configuration, OpenAIApi } = require("openai");
const sleep = require("../../utils/sleep");
const commandsList = require("./cmd/index");
const getListOfAvailableCommands = require("./utils/getListOfAvailableCommands");

const configuration = new Configuration({
  apiKey: process.env.XEST_GPT_KEY,
});
const openai = new OpenAIApi(configuration);

const getTotalComputationCost = ({
  totalPromptTokens = 0,
  totalCompletionTokens = 0,
}) => {
  // https://openai.com/pricing
  // gpt-3.5-turbo -> $0.002 / 1K tokens
  const gptTurboCost = 0.002;

  const cost =
    ((totalPromptTokens + totalCompletionTokens) / 1000) * gptTurboCost;
  return cost;
};

// limit ai usage so we don't hit out quota with a single query
const MAX_COST = 0.001;

const listOfCommandNames = commandsList.map(c => c.name);

const ai = async () => {
  const projectDetails = findProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a Xest project directory. Please check your current path directory.`
    );
    return;
  }

  let answered = false;
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;
  let step_debug =0;
  let callHistory = [];

  let messages = [
    { role: "system", content: getInitialPrompt() },
  ];
  const answer = await inquirer.prompt({
    type: "input",
    name: "qry",
    message: "Welcome to XestGPT. What would you like help with today?\n",
  });
  messages.push({ role: "user", content: answer.qry });
  messages.push({ role: "system", content: `You can run one command at a time that are listed below.

  START LIST OF AVAILABLE COMMANDS
  ${getAvailableCommandDescriptions(getListOfAvailableCommands({ commandsList, callHistory }))}
  END LIST OF AVAILABLE COMMANDS

  You can only run one of the commands to run.

  Think step by step and decide which command to run.` });

  while (
    !answered &&
    getTotalComputationCost({ totalPromptTokens, totalCompletionTokens }) <
      0.002
  ) {
    step_debug += 1;
    if(step_debug > 1) {
      // pace it out for subsequent requests, so we don't get rate limited
      await sleep(100);
    }
    
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

    const answer = completion.data.choices[0].message.content;
    // keep assistant history
    messages.push(completion.data.choices[0].message);

    // todo: list of command names should only
    // contain re-runnable commands that we haven't run before

    /*
    const doesAnswerContainCommandToRun = listOfCommandNames.filter(cmd => answer.includes(cmd));
    const newCommandsToRun = doesAnswerContainCommandToRun.filter(cmd => !commandsRunBefore.includes(cmd));

    newCommandsToRun.forEach(newCmd => {
      const commandToRun = commandsList.find(cmd => cmd.name === newCmd);
      console.log(commandToRun, "CommandToRun");

      if(newCmd === 'getDatabaseTableSchema') {
        messages.push({ role: "system", content: `You need to provide a tableName parameter to getDatabaseTableSchema command. You can run getListOfDatabaseTables command to find table names. Can you provide the parameter please?` });
      } else {
        commandsRunBefore.push(newCmd);
        messages.push({ role: "system", content: `Output of ${doesAnswerContainCommandToRun} command: ${commands[newCmd]}. Do you have everything you need to answer user's question? Let's think step by step. If you want to run another command to check say the name of the command. Don't forget you can only run the commands from the list. You can't ask anything else. If you are ready to answer REPLY with BINGO.` });
      }
    });

    if(!newCommandsToRun.length) {
      // ai didn't ask for a new command to run, so we can assume it has finished
      answered = true;

      // console.log("log of messages", messages);
      console.log(`LATEST ANSWER:`, completion.data.choices);
    }
  */

    // stop ai from going wild
    if(step_debug === 1) {
      answered = true;
    }
  }
  console.log(messages)
  console.log(`total cost`, getTotalComputationCost({ totalPromptTokens, totalCompletionTokens }));
};

module.exports = {
  ai,
};
