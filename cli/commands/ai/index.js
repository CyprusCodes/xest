const express = require("express");
const get = require("lodash/get");
const chalk = require("chalk");
const cors = require("cors");
const has = require("lodash/has");
const findProjectRoot = require("../../utils/findProjectRoot");
const sleep = require("../../utils/sleep");
const commandsList = require("./cmd/index");
const getListOfAvailableCommands = require("./utils/getListOfAvailableCommands");
const fs = require("fs");
const generateCompletion = require("./utils/generateCompletion");

const ai = () => {
  // ai only works at Xest project root
  const projectDetails = findProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a Xest project directory. Please check your current path directory.`
    );
    return;
  }

  const app = express();
  app.use(cors());

  app.use(express.json({ limit: "100mb" }));

  app.post("/session", async (request, response) => {
    const model = request.body.model || "gpt-3.5-turbo-1106";
    const maxTokens = request.body.maxTokens || 200;
    const temperature = request.body.temperature || 0;
    const messages = request.body.messages || [];

    const callHistory = messages
      .filter((msg) => get(msg, "tool.name"))
      .map((msg) => {
        return { name: msg.tool.name, content: msg.tool.args };
      });

    const availableFunctions = getListOfAvailableCommands({
      commandsList,
      callHistory,
    });

    // todo: find a better mechanism?
    // pace it out for subsequent requests, so we don't get rate limited
    await sleep(100);

    const lastMessage = messages[messages.length - 1];
    const isLastMessageFunctionCall = has(lastMessage, "tool.name");
    const isLastMessageFromUser = lastMessage.role === "user";

    // todo: what if function to run is not valid?
    if (
      isLastMessageFunctionCall &&
      lastMessage.tool.confirmed &&
      !lastMessage.tool.runAt
    ) {
      const functionName = lastMessage.tool.name;
      const cmdToRun = commandsList.find((fn) => fn.name === functionName);

      const results = await cmdToRun.runCmd(lastMessage.tool.args);
      lastMessage.tool.runAt = new Date().toISOString();
      lastMessage.tool.output = JSON.stringify(results);

      // todo: this message used to refer to original user intent
      messages.push({
        unuseful: false,
        hiddenFromUser: false,
        role: "user",
        message: `Consider the output of the ${functionName}. Does this give you enough information to answer my query? Think step by step. Run tools if necessary, using the previous information collected where applicable.`,
      });

      const newMessages = await generateCompletion({
        messages,
        model,
        maxTokens,
        temperature,
        availableFunctions,
        commandsList,
      });

      return response.send({ messages: newMessages });
    }

    if (isLastMessageFunctionCall && !lastMessage.tool.confirmed) {
      messages.push({
        unuseful: false,
        hiddenFromUser: false,
        role: "user",
        message: `User decided running ${functionName} tool is irrelevant. Reconsider the list of available tools, and also the conversation so far to respond back.`,
      });

      const newMessages = await generateCompletion({
        messages,
        model,
        maxTokens,
        temperature,
        availableFunctions,
        commandsList,
      });

      return response.send({ messages: newMessages });
    }

    if (isLastMessageFromUser) {
      const newMessages = await generateCompletion({
        messages,
        model,
        maxTokens,
        temperature,
        availableFunctions,
        commandsList,
      });

      return response.send({ messages: newMessages });
    }

    // assistant response, do nothing
    return response.send({ messages: newMessages });
  });

  app.listen(1313, () => {
    console.log(chalk.green`XestGPT is available on http://localhost:1313`);
    var start =
      process.platform == "darwin"
        ? "open"
        : process.platform == "win32"
        ? "start"
        : "xdg-open";
    // require("child_process").exec(start + " http://localhost:1313");
  });
};

module.exports = {
  ai,
};
