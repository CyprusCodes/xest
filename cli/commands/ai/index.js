const chalk = require("chalk");
const inquirer = require("inquirer");
const findProjectRoot = require("../../utils/findProjectRoot");
const {
  getInitialPrompt,
  getAvailableCommandDescriptions,
} = require("./prompts/index");
const { Configuration, OpenAIApi } = require("openai");
const sleep = require("../../utils/sleep");
const commandsList = require("./cmd/index");
const getListOfAvailableCommands = require("./utils/getListOfAvailableCommands");
const fs = require("fs");
const sample = require("./sample.json");

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

const getTotalComputationTime = (startDate, endDate) => {
const dif = startDate.getTime() - endDate.getTime();

const Seconds_from_T1_to_T2 = dif / 1000;
const Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
return Seconds_Between_Dates;
}

// limit ai usage so we don't hit out quota with a single query
const MAX_COST = 0.001;

const listOfCommandNames = commandsList.map((c) => c.name);

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
  let step_debug = 0;
  let callHistory = [];

  let messages = [{ role: "system", content: getInitialPrompt() }];
  const answer = await inquirer.prompt({
    type: "input",
    name: "qry",
    message: "Welcome to XestGPT. What would you like help with today?\n",
  });

  let computationStartTime = new Date();
  messages.push({ role: "user", content: answer.qry });
  messages.push({
    role: "system",
    content: `START COMMAND LIST
  ${getAvailableCommandDescriptions(
    getListOfAvailableCommands({ commandsList, callHistory })
  )}
  END COMMAND LIST`,
  });
  messages.push({
    role: "system",
    content:
      "Investigate the list of commands available to you. Think in steps and pick a command to run.",
  });

  while (
    !answered &&
    getTotalComputationCost({ totalPromptTokens, totalCompletionTokens }) <
      0.002
  ) {
    step_debug += 1;
    if (step_debug > 1) {
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

    const doesAnswerContainCommandToRun = listOfCommandNames.filter((cmd) =>
      answer.includes(cmd)
    );
    const newCommandsToRun = doesAnswerContainCommandToRun.filter(
      (cmd) => !callHistory.map((call) => call.name).includes(cmd)
    );

    const notReadyToAnswer = answer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").includes("no ");

    if(notReadyToAnswer) {
      messages.push({
        role: "system",
        content: `START COMMAND LIST
      ${getAvailableCommandDescriptions(
        getListOfAvailableCommands({ commandsList, callHistory })
      )}
      END COMMAND LIST`,
      });
      messages.push({
        role: "system",
        content:
          "Investigate the list of commands available to you. Think in steps and pick a command to run.",
      });
    }
    

    newCommandsToRun.forEach((newCmd) => {
      const commandToRun = commandsList.find((cmd) => cmd.name === newCmd);

      if (newCmd === "getDatabaseTableSchema") {
        messages.push({
          role: "system",
          content: `You need to provide a tableName parameter to getDatabaseTableSchema command. You can run getListOfDatabaseTables command to find table names. Can you provide the parameter please?`,
        });
      } else {
        callHistory.push(commandToRun);
        messages.push({
          role: "system",
          content: `Command: ${doesAnswerContainCommandToRun}\n Command Description: ${commandToRun.description} OUTPUT: ${commandToRun.runCmd()}}.`,
        });
        messages.push({
          role: "system",
          content:
            `Investigate the output of ${doesAnswerContainCommandToRun}. Do you think you have enough information to respond back to user's query. Reply with Yes or No.`,
        });
      }
    });

    if (!newCommandsToRun.length && !notReadyToAnswer) {
      // ai didn't ask for a new command to run, so we can assume it has finished
      answered = true;

      // console.log("log of messages", messages);
      console.log(`LATEST ANSWER:`, completion.data.choices[0].message.content);
    }

    // stop ai from going wild
    if (step_debug === 6) {
      answered = true;
    }
  }
  fs.writeFileSync("./sample.json", JSON.stringify(messages, null, 2));
  console.log(
    `total computation time `,
    getTotalComputationTime(computationStartTime, new Date()),
    " seconds"
  );
  console.log(
    `total computation cost $`,
    getTotalComputationCost({ totalPromptTokens, totalCompletionTokens })
  );
};

const aiReplay = async () => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: sample,
    max_tokens: 100,
    temperature: 0,
  });
  console.log(`LATEST ANSWER:`, completion.data.choices);
};

module.exports = {
  ai: ai,
};
