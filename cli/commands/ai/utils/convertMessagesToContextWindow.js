const flattenDeep = require("lodash/flattenDeep");
const { getInitialPrompt } = require("./prompts/index");

const convertMessagesToContextWindow = (messages) => {
  const filteredMessages = messages.filter((message) => !message.unuseful);
  const filteredMessagesWithInitialSystemPrompt = [
    { role: "system", message: getInitialPrompt() }, // message key is NOT a mistake here, intentional
    ...filteredMessages,
  ];

  const contextWindow = filteredMessagesWithInitialSystemPrompt.map((message) => {
    if (message.tool && message.tool.confirmed && message.tool.runAt) {
      return [
        {
          role: "assistant",
          content: null,
          function_call: {
            name: message.tool.name,
            arguments: JSON.stringify(message.tool.args),
          },
        },
        {
          role: "function",
          name: message.tool.name,
          content: message.tool.output,
        },
      ];
    }

    if (message.tool) {
      return [
        {
          role: "assistant",
          content: null,
          function_call: {
            name: message.tool.name,
            arguments: JSON.stringify(message.tool.args),
          },
        },
      ];
    }

    return {
      role: message.role,
      content: message.message,
    };
  });

  return flattenDeep(contextWindow);
};

module.exports = convertMessagesToContextWindow;
