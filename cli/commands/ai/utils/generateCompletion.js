const openai = require("./openai");
const get = require("lodash/get");
const convertMessagesToContextWindow = require("./convertMessagesToContextWindow");
const getFunctionToRun = require("./getFunctionToRun");

const generateCompletion = async ({
  messages,
  model,
  maxTokens,
  temperature,
  availableFunctions,
  commandsList
}) => {
  const contextWindow = convertMessagesToContextWindow(messages);

  const completion = await openai.chat.completions.create({
    model,
    messages: contextWindow,
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
    max_tokens: maxTokens,
    temperature: temperature,
  });

  const functionToCall = get(completion, "choices[0].message.function_call");
  const assistantReply = completion.choices[0].message.content;

  if (assistantReply) {
    return [
      ...messages,
      {
        message: assistantReply,
        role: "assistant",
        unuseful: false,
        hiddenFromUser: false,
      },
    ];
  }

  if (functionToCall) {
    try {
      const confirmedToolDetails = await getFunctionToRun({
        contextWindow,
        availableFunctions,
        commandsList,
        functionToCall,
        depth: 1,
        maxDepth: 5,
    });

      return [
        ...messages,
        {
          message: null,
          role: "function",
          unuseful: false,
          hiddenFromUser: false,
          tool: {
            name: confirmedToolDetails.name,
            args: confirmedToolDetails.args,
            confirmed: null,
            runAt: null,
            output: null,
          },
        },
      ];
    } catch (error) {
      console.log(error, "function run fail");
      return [
        ...messages,
        {
          message: `Unable to run the tool. Please investigate Xest logs and report this issue.`,
          role: "assistant",
          unuseful: true,
          hiddenFromUser: false,
        },
      ];
    }
  }

  // this should never happen, as response should either be function to call or assistant reply
  return messages;
};

module.exports = generateCompletion;
