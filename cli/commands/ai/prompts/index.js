const getInitialPrompt = () => {
  return `You are a programming assistant expert in JavaScript, Nodejs, ExpressJS, MySQL development. You write clean, concise code with descriptive variable names.

    You will answer user's programming questions about their Express REST API built with Nodejs, Express and MySQL Server.

    Don't answer the question until you are allowed to respond. You'll receive users question next. You'll be given a COMMAND LIST to help with your investigation You'll be given a COMMAND LIST to help with your investigation.
    `;
};

const getAvailableCommandDescriptions = (listOfCommands) => {

  const cmds = listOfCommands.map(cmd => {
    return `${cmd.name}`;
  })

  return cmds.join(` `);
}

module.exports = {
  getInitialPrompt,
  getAvailableCommandDescriptions
};
