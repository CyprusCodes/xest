const insertOrganization = require("./queries/insertOrganization");

const createOrganization = async ({ name }) => {
  const organizationId = await insertOrganization({ name });

  return { organizationId };
};

module.exports = createOrganization;
