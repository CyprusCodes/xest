const jwt = require("jsonwebtoken");
const createCompleteRegistration = require("~root/actions/users/createCompleteRegistration");
const handleApiError = require("~root/utils/handleAPIError");
const fetchRegistrationRequestByShortcode = require("~root/actions/users/fetchRegistrationRequestByShortcode");
const modifyRegistrationRequestStatus = require("~root/actions/users/modifyRegistrationRequestStatus");
const createOrganizationUser = require("~root/actions/organizations/createOrganizationUser");
const createOrganization = require("~root/actions/organizations/createOrganization");

const postCompleteRegistration = async (req, res) => {
  const {
    registrationShortcode
  } = req.params;

  try {
    const { potentialNewUserData } = await fetchRegistrationRequestByShortcode({
      registrationShortcode
    });

    const {
      firstName,
      lastName,
      email,
      password,
      companyName,
      phoneNumber
    } = potentialNewUserData;

    const { userId } = await createCompleteRegistration({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userTypeId
    });

    const { organizationId } = await createOrganization({
      companyName
    });

    const userOrganizationRoleId = 1;
    await createOrganizationUser({
      userId,
      userOrganizationRoleId,
      organizationId,
      addedBy: userId
    });

    await modifyRegistrationRequestStatus({ registrationShortcode });

    const accessToken = jwt.sign(
      { ...potentialNewUserData, userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h" // 2 Hours
      }
    );

    res.send({
      userId,
      accessToken
    });
  } catch (err) {
    handleApiError(res, err);
  }
};

module.exports = postCompleteRegistration;
