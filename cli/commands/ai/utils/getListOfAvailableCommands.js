const getListOfAvailableCommands = ({ commandsList, callHistory }) => {
    return commandsList.filter(cmd => {
        // command does not have prerequisites, and it can be rerun infinite times
        if(!cmd.prerequisites.length && (cmd.rerun || cmd.rerunWithDifferentParameters)) {
            return true;
        }

        // command does not have prerequisites, it can only be run once, but we didnt run it before
        const commandWasRunBefore = callHistory.some(call => call.name === cmd.name);
        if(!cmd.prerequisites.length && (!cmd.rerun || !cmd.rerunWithDifferentParameters) && !commandWasRunBefore) {
            return true;
        }

        const allPrerequisiteCommands = cmd.prerequisites.map(req => req.command.name);
        const allPrerequisiteCommandsWereRun = allPrerequisiteCommands.every(req => callHistory.some(call => call.name === req))

        // command has prerequisites, and all were done
        if (cmd.prerequisites.length && allPrerequisiteCommandsWereRun) {
            if (cmd.rerun || cmd.rerunWithDifferentParameters) {
                return true;
            }
            if((!cmd.rerun || !cmd.rerunWithDifferentParameters) && !commandWasRunBefore) {
                return true;
            }
        }

        return false;
    });
};

module.exports = getListOfAvailableCommands;
