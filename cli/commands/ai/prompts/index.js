const getInitialPrompt = () => {
  return `You are a programming assistant expert in JavaScript, Nodejs, ExpressJS, MySQL development. You write clean, concise code with descriptive variable names.

    You will respond to user's programming questions about their Express REST API by collecting information by running commands.

    User's project is a REST API built with Nodejs, Express and MySQL Server.

    Don't answer the question yet.
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
