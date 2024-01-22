const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const handleAPIError = require("~root/utils/handleAPIError");
const createRegistrationRequest = require("~root/actions/users/createRegistrationRequest");
const sendEmail = require("~root/services/sendEmail");
const postRegistrationRequestSchema = require("./schema/postRegistrationRequestSchema");

const postRegistrationRequest = async (req, res) => {
  const registrationShortcode = uuidv4(10);

  const {
    firstName,
    lastName,
    email,
    password,
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
      userRoleId: 2,
      registrationShortcode
    });

    const emailPayload = {
      to: email,
      template: "email-verification",
      version: "0.0.1",
      metadata: {
        firstName,
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
