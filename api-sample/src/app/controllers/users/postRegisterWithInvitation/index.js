const axios = require("axios");
const handleAPIError = require("~root/utils/handleAPIError");
const fetchInvitationByShortCode = require("~root/actions/invitations/fetchInvitationByShortCode");
const createUser = require("~root/actions/users/createUser");
const createOrganizationUser = require("~root/actions/organizations/createOrganizationUser");
const postRegisterWithInvitationSchema = require("./schema/postRegisterWithInvitationSchema");

// eslint-disable-next-line consistent-return
const postRegisterWithInvitation = async (req, res) => {
  const { firstName, lastName, password, captcha } = req.body;

  const { invitationShortcode } = req.params;

  try {
    await postRegisterWithInvitationSchema.validate(
      {
        firstName,
        lastName,
        password,
        invitationShortcode
      },
      {
        abortEarly: false
      }
    );

    if (!captcha) {
      return res.status(400).json({ error: "captcha is required" });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const verificationParams = {
      secret: secretKey,
      response: captcha
    };

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const { data } = await axios.post(verificationUrl, verificationParams);

    if (!data.success) {
      return res.status(500).send({ error: "Captcha verification failed" });
    }

    const { invitation } = await fetchInvitationByShortCode({
      invitationShortcode
    });

    const {
      organizationId,
      invitedBy,
      userOrganizationRoleId,
      email
    } = invitation;

    const { user } = await createUser({
      firstName,
      lastName,
      password,
      email,
      isSuperAdmin: 0
    });

    const { organizationUserId } = await createOrganizationUser({
      userId: user,
      userOrganizationRoleId,
      organizationId,
      addedBy: invitedBy
    });

    res.status(201).send({
      user,
      organizationUserId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postRegisterWithInvitation;
