const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const findProjectRoot = require("../../utils/findProjectRoot");
const commandsList = require("./cmd/index");

const XESTGPT_PORT = 1313;

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

  app.get("/cmnd-tools", (req, res) => {
    const getTools = () => {
      const toolsMapped = commandsList.map((t) => {
        return {
          name: t.name,
          description: t.description,
          jsonSchema: t.parameters,
          isDangerous: t.dangerous,
          functionType: t.functionType,
          isLongRunningTool: false,
          rerun: t.rerun,
          rerunWithDifferentParameters: t.rerunWithDifferentParameters,
        };
      });
      return { tools: toolsMapped };
    };
  
    const toolsResponse = getTools();
    res.json(toolsResponse);
  });
  
  app.post("/run-cmnd-tool", async (req, res) => {
    const args = req.body;
    console.log({ commandsList, args })
    const toolToRun = commandsList.find((t) => t.name === args.toolName);
    const results = await toolToRun.runCmd(args.props);
    res.send(results);
  });

  app.listen(XESTGPT_PORT, () => {
    console.log(chalk.green`XestGPT is available on http://localhost:${XESTGPT_PORT}`);
  });
};

module.exports = {
  ai,
};
