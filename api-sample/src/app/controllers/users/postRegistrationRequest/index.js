const { nanoid } = require("nanoid");
const axios = require("axios");
const handleAPIError = require("~root/utils/handleAPIError");
const createRegistrationRequest = require("~root/actions/users/createRegistrationRequest");
const sendEmail = require("~root/services/sendEmail");
const postRegistrationRequestSchema = require("./schema/postRegistrationRequestSchema");

const postRegistrationRequest = async (req, res) => {
  const registrationShortcode = nanoid(10);

  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    companyName,
    captcha
  } = req.body;

  try {
    await postRegistrationRequestSchema.validate(
      {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        companyName
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

    const { createdRegistrationRequest } = await createRegistrationRequest({
      firstName,
      lastName,
      email,
      password,
      companyName,
      phoneNumber,
      userRoleId: 2,
      registrationShortcode,
    });

    const emailPayload = {
      to: email,
      template: "email-verification",
      version: "0.0.1",
      metadata: {
        emailVerification: `${process.env.APP_BASE_URL}/complete-registration/${registrationShortcode}`
      }
    };
    sendEmail(emailPayload);

    res.status(201).send({
      createdRegistrationRequest
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postRegistrationRequest;
