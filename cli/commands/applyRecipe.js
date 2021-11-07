const chalk = require("chalk");
const allRecipes = require("../recipes/index");
const asyncSeries = require("../utils/asyncSeries");
const findJustRestProjectRoot = require("../utils/findProjectRoot");
const path = require("path");

const executeRecipe = async ({
  recipeToApply,
  projectRootPath,
  projectName
}) => {
  const recipeDirectory = recipeToApply.name;
  const userVariables = await recipeToApply.userPrompt(projectRootPath);
  await asyncSeries(recipeToApply.files, async file => {
    const baseTemplatePath = path.join(
      __dirname,
      "../recipes/",
      recipeDirectory
    );
    const sourceFileName = path.basename(file.source);
    const sourceFilePath = path.join(baseTemplatePath, "template", file.source);
    const sourceFileParentDirectory = path.dirname(sourceFilePath);

    const targetFilePath = await file.targetFileNameMapper({
      sourceFileName,
      sourceFilePath,
      sourceFileRelative: file.source,
      sourceFileParentDirectory,
      projectRootPath,
      projectName,
      userVariables
    });
    if (targetFilePath !== null) {
      await file.targetFileWriter({
        sourceFileName,
        sourceFilePath,
        sourceFileParentDirectory,
        projectRootPath,
        projectName,
        userVariables,
        targetFilePath
      });
    }
  });
};

const applyRecipe = async () => {
  const projectDetails = findJustRestProjectRoot();
  if (!projectDetails) {
    console.log(
      chalk.red`You are not within a justREST project directory. Please check your current path directory.`
    );
    return;
  }

  const {
    value: { name: projectName }
  } = projectDetails;

  const { filename } = projectDetails;
  const projectRootPath = path.dirname(filename);

  const subcommandIndex = process.argv.findIndex(arg => arg === "new");
  const recipeName = process.argv[subcommandIndex + 1];
  const recipeToApply = allRecipes.find(recipe => recipe.name === recipeName);

  if (recipeToApply) {
    await executeRecipe({ recipeToApply, projectName, projectRootPath });
  }

  // user might have made a typo
  if (recipeName && !recipeToApply) {
    console.log(
      chalk.red`No recipe found for ${recipeName}, reverting to wizard.`
    );
  }

  // todo inquirer goes here
};

module.exports = {
  applyRecipe
};