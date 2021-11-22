const faker = require("faker");

const trimSampleOutput = (output) => {
  let string = output.replace(/  |\r\n|\n|\r/gm, "").replace(/\\"/g, '"');
  if (string.length > 80) {
    return string.substring(0, 77) + "...";
  }
  return string;
};

const getFakerExample = (methodToCall) => {
  try {
    const out = faker.fake(`{{${methodToCall}}}`);
    return trimSampleOutput(out);
  } catch (error) {
    console.error("CLI failed to generate seed data.");
    console.log(error);
    return "";
  }
};

module.exports = getFakerExample;
