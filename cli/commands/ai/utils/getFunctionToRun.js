const get = require("lodash/get");
const has = require("lodash/has");

const getFunctionToRun = async ({
  contextWindow,
  availableFunctions,
  commandsList,
  functionToCall,
  depth,
  maxDepth,
}) => {
  const cmdToRun = commandsList.find(
    (fn) => fn.name === get(functionToCall, "name")
  );
  const messages = [...contextWindow];

  const callHistory = messages
    .filter((msg) => has(msg, "function_call"))
    .map((msg) => {
      return {
        name: msg.function_call.name,
        content: msg.function_call.arguments,
      };
    });

  if (cmdToRun) {
    const { parsedArgumentsSuccesfully, message, parsedArguments } =
      await cmdToRun.parameterize({
        arguments: functionToCall.arguments,
        messages,
        callHistory,
        functionName: functionToCall.name,
      });

    if (parsedArgumentsSuccesfully) {
      return {
        name: functionToCall.name,
        args: parsedArguments,
      };
    } else {
      messages.push({
        role: "user",
        content: message,
      });
    }
  } else if (functionToCall) {
    // AI wanted to run a non-existing function
    messages.push({
      role: "user",
      content: `There is no tool available called ${functionToCall}. Try running another tool from the available tools.`,
    });
  }

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

  const newFunctionToCall = get(completion, "choices[0].message.function_call");
  if (!functionToCall || depth > maxDepth) {
    console.log(messages, "debug context window");
    throw new Error("Function correction failed");
  }

  return getFunctionToRun({
    contextWindow: messages,
    availableFunctions,
    commandsList,
    functionToCall: newFunctionToCall,
    depth: depth + 1,
    maxDepth,
  });
};

module.exports = getFunctionToRun;
