const chalk = require("chalk");
const inquirer = require("inquirer");
const findProjectRoot = require("../../utils/findProjectRoot");
const { getInitialPrompt } = require("./prompts/index");
const sleep = require("../../utils/sleep");
const commandsList = require("./cmd/index");
const getListOfAvailableCommands = require("./utils/getListOfAvailableCommands");
const fs = require("fs");
const openai = require("./utils/openai");
const getComputationCost = require("./utils/getComputationCost");
const getComputationTime = require("./utils/getComputationTime");

// limit ai usage so we don't hit out quota with a single query
const MAX_COST = 1;
const OPENAI_MODEL = "gpt-3.5-turbo-1106"; //"gpt-4-1106-preview";

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
  const userQuery = await inquirer.prompt({
    type: "input",
    name: "qry",
    message: "Welcome to XestGPT. What would you like help with today?\n",
  });

  let computationStartTime = new Date();
  messages.push({ role: "user", content: userQuery.qry });

  while (
    !answered &&
    getComputationCost({
      totalPromptTokens,
      totalCompletionTokens,
      model: OPENAI_MODEL,
    }) < MAX_COST
  ) {
    step_debug += 1;
    if (step_debug > 1) {
      // pace it out for subsequent requests, so we don't get rate limited
      await sleep(100);
    }

    const availableFunctions = getListOfAvailableCommands({
      commandsList,
      callHistory,
    });
    console.log(
      availableFunctions.map((fn) => fn.name),
      "availableFns"
    );

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      ...(availableFunctions.length
        ? {
            functions: availableFunctions.map((f) => {
              return {
                name: f.name,
                description: f.description,
                parameters: f.parameters,
              };
            }),
          }
        : {}),
      max_tokens: 200,
      temperature: 0,
    });

    const { prompt_tokens, completion_tokens } = completion.usage;
    totalPromptTokens += prompt_tokens;
    totalCompletionTokens += completion_tokens;

    const answer = completion.choices[0].message.content;

    // todo: keep assistant history only if they're not hallunicating or relevant to the task at hand
    // keep assistant history
    messages.push(completion.choices[0].message);

    const functionToCall = completion.choices[0].message.function_call;
    const assistantReply = completion.choices[0].message.content;

    if (functionToCall) {
      const cmdToRun = commandsList.find(
        (fn) => fn.name === functionToCall.name
      );

      console.log(functionToCall, "huh???");
      const { parsedArgumentsSuccesfully, message, parsedArguments } =
        await cmdToRun.parameterize({
          arguments: functionToCall.arguments,
          messages,
          callHistory,
          functionName: functionToCall.name,
        });

      if (parsedArgumentsSuccesfully) {
        callHistory.push({
          name: functionToCall.name,
          content: functionToCall.arguments,
        });

        console.log(
          `Running tool: ${functionToCall.name}(${JSON.stringify(
            parsedArguments,
            null,
            2
          )})`
        );

        const results = await cmdToRun.runCmd(parsedArguments);
        console.log(results);

        messages.push({
          role: "function",
          name: functionToCall.name,
          content: JSON.stringify(results),
        });

        messages.push({
          role: "user",
          content: `Consider the output of the ${functionToCall.name}. Does this give you enough information to answer my query: ${userQuery.qry}? Think step by step. Run functions if necessary, using the previous information collected where applicable.`,
        });
      } else {
        messages.push({
          role: "user",
          content: message,
        });
      }
    } else if (assistantReply) {
      console.log(assistantReply);
      const userIntervention = await inquirer.prompt({
        type: "input",
        name: "qry",
        message: "\nType EXIT to quit or instruct AI further to continue.\n",
      });

      if (userIntervention.qry.toLowerCase().includes("exit")) {
        answered = true;
      }
      messages.push({
        role: "user",
        content: userIntervention.qry,
      });
    }

    // stop ai from going wild
    if (step_debug === 15) {
      console.log(step_debug, "Steps");
      answered = true;
    }
  }
  fs.writeFileSync("./sample.json", JSON.stringify(messages, null, 2));
  console.log(
    `total computation time `,
    getComputationTime(computationStartTime, new Date()),
    " seconds"
  );
  console.log(
    `total computation cost $`,
    getComputationCost({
      totalPromptTokens,
      totalCompletionTokens,
      model: OPENAI_MODEL,
    })
  );
};

const aiReplay = async () => {
  const completion = await openai.createChatCompletion({
    model: OPENAI_MODEL,
    // messages: sample,
    max_tokens: 100,
    temperature: 0,
  });
  console.log(`LATEST ANSWER:`, completion.choices);
  const { prompt_tokens, completion_tokens, total_tokens } = completion.usage;
  const totalPromptTokens = prompt_tokens;
  const totalCompletionTokens = completion_tokens;
  // console.log(sample);
  console.log(
    "total cost $",
    getComputationCost({
      totalPromptTokens,
      totalCompletionTokens,
      model: OPENAI_MODEL,
    })
  );
};

module.exports = {
  ai,
};
