const handleAPIError = require("~root/utils/handleAPIError");
const createOrganization = require("~root/actions/organizations/createOrganization");
const createOrganizationUser = require("~root/actions/organizations/createOrganizationUser");
const postOrganizationSchema = require("./schemas/postOrganizationSchema");

const postOrganization = async (req, res) => {
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

    const { organizationId } = await createOrganization({ organizationName });

    await createOrganizationUser({
      userId,
      userOrganizationRoleId: 1,
      organizationId,
      addedBy: userId
    });

    res.status(201).send({
      organizationId,
      organizationAdmin: userId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postOrganization;
