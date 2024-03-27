const createNewOrganization = require("~root/actions/organizations/createNewOrganization");
const handleAPIError = require("~root/utils/handleAPIError");
const postOrganizationSchema = require("./schemas/postOrganizationSchema");

const postNewOrganization = async (req, res) => {
  const { userId } = req.user;
  const { organizationName } = req.body;
  try {
    await postOrganizationSchema.validate(
      {
        userId,
        organizationName
      },
      {
        abortEarly: false
      }
    );
    const { organizationId } = await createNewOrganization({
      organizationName
    });
    res.status(201).send({ organizationId });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postNewOrganization;
