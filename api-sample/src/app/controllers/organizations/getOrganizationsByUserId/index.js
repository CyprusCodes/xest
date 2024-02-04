const fetchOrganizationsByUserId = require("~root/actions/organizations/fetchOrganizationsByUserId");
const handleAPIError = require("~root/utils/handleAPIError");
const getOrganizationsByUserIdSchema = require("./schemas/getOrganizationsByUserIdSchema");

const getOrganizationsByUserId = async (req, res) => {
  const { userId } = req.user;
  try {
    await getOrganizationsByUserIdSchema.validate(
      {
        userId
      },
      {
        abortEarly: false
      }
    );
    const { organizations } = await fetchOrganizationsByUserId({ userId });
    res.status(200).send({
      organizations
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getOrganizationsByUserId;
