const faker = require("@faker-js/faker");
const isEmpty = require("lodash/isEmpty");

const parseColumnTypeArgs = (columnType) => {
  // https://stackoverflow.com/a/36195444
  const match = columnType.match(/(?:\()(.+)+(?:\))/);

  if (!match) {
    return [];
  }

  return match[1].split(/[\s,]+/).filter(function (e) {
    return e;
  });
};

const trimSampleOutput = (output) => {
  let string = output.replace(/  |\r\n|\n|\r/gm, "").replace(/\\"/g, '"');
  if (string.length > 80) {
    return string.substring(0, 77) + "...";
  }
  return string;
};

const getFakerExample = (methodToCall) => {
  try {
    const out = getFakerValue(methodToCall);
    return trimSampleOutput(out);
  } catch (error) {
    // console.error("CLI failed to generate seed data.");
    // console.log(error);
    return "";
  }
};

const getFakerValue = (methodToCall) => {
  const out = faker.fake(`{{${methodToCall}}}`);
  if (methodToCall.includes("lorem.words")) {
    let trim = out.replace(/  |\r\n|\n|\r/gm, "").replace(/\\"/g, '"');
    const [size] = parseColumnTypeArgs(methodToCall);
    return trim.substring(0, size);
  }

  const isDate = !isEmpty(out.match(/(\d{2}:){2}\d{2}/));
  if (isDate) {
    const date = new Date(out);
    return date.toISOString();
  }

  return out.replace(/\"/g, ""); // strip "
};

module.exports = { getFakerExample, getFakerValue };
