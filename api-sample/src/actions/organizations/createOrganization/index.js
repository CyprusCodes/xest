const insertOrganization = require("./queries/insertOrganization");

const createOrganization = async ({ companyName }) => {
  const organizationId = await insertOrganization({ companyName });

  return { organizationId };
};

module.exports = createOrganization;
