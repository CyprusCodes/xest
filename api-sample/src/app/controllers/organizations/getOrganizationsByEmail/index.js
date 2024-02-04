const fetchOrganizationsByEmail = require("~root/actions/organizations/fetchOrganizationsByEmail");
const handleAPIError = require("~root/utils/handleAPIError");
const getOrgOverviewSchema = require("./schemas/getOrganizationsByEmailSchema");

const getOrganizationsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    await getOrgOverviewSchema.validate(
      {
        email
      },
      {
        abortEarly: false
      }
    );
    const { organizations } = await fetchOrganizationsByEmail({ email });
    res.status(200).send({
      organizations
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getOrganizationsByEmail;
