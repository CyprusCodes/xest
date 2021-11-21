const inquirer = require("inquirer");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
const searchList = require("inquirer-search-list");
inquirer.registerPrompt("search-list", searchList);

const useForm = () => {
  const questions = [];
  const values = {};
  let answerIndex = 0;

  addField = (fieldFn) => questions.push(fieldFn);
  addArrayField = (fieldFn) => {
    fieldFn.isArrayField = true;
    questions.push(fieldFn);
    return {
      add: () => {
        questions.splice(answerIndex, 0, fieldFn);
      },
    };
  };

  getAnswers = async () => {
    for (const question of questions) {
      const questionObj = question(values);
      if (!questionObj) {
        continue;
      }
      const results = await inquirer.prompt(questionObj);
      const answer = results[questionObj.name];

      if (question.isArrayField) {
        values[questionObj.name] = values[questionObj.name] || [];
        values[questionObj.name].push(answer);
      } else {
        values[questionObj.name] = answer;
      }
      answerIndex++;

      if (questionObj.onReply) {
        await questionObj.onReply(answer);
      }
    }
    return values;
  };

  getValues = () => {
    return values;
  };

  return { addField, addArrayField, getAnswers, getValues };
};

module.exports = useForm;
