// taken from
// https://openai.com/pricing
// as of Sun 26 Nov 2023

const modelPrices = {
  "gpt-4-1106-preview": {
    input: 0.01, // per 1k tokens
    output: 0.03, // per 1k tokens
  },
  "gpt-3.5-turbo-1106": {
    input: 0.001, // per 1k tokens
    output: 0.002, // per 1k tokens
  },
};

const getComputationCost = ({
  totalPromptTokens = 0,
  totalCompletionTokens = 0,
  model,
}) => {
  const modelCost = modelPrices[model];
  const totalPromptCost = (totalPromptTokens / 1000) * modelCost.input;
  const totalCompletionCost = (totalCompletionTokens / 1000) * modelCost.output;

  return totalPromptCost + totalCompletionCost;
};

module.exports = getComputationCost;
