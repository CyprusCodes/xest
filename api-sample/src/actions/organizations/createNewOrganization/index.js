const insertOrganization = require("./queries/insertOrganization");

const createOrganization = async ({ organizationName }) => {
  const organizationId = await insertOrganization({ organizationName });
  return { organizationId };
};

module.exports = createOrganization;
