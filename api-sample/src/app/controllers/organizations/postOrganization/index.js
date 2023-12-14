const handleAPIError = require("~root/utils/handleAPIError");
const createOrganization = require("~root/actions/organizations/createOrganization");
const createOrganizationUser = require("~root/actions/organizations/createOrganizationUser");
const postOrganizationSchema = require("./schemas/postOrganizationSchema");

const organizationAdmin = 1;

const postOrganization = async (req, res) => {
  const { userId } = req.user;
  const { name } = req.body;

  try {
    await postOrganizationSchema.validate(
      {
        userId,
        name
      },
      {
        abortEarly: false
      }
    );

    const { organizationId } = await createOrganization({ name });

    const userRoleId = organizationAdmin;

    await createOrganizationUser({
      userId,
      userRoleId,
      organizationId
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
