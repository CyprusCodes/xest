const { v4: uuidv4 } = require("uuid");
const createRecoveryRequest = require("~root/actions/password-recovery/createRecoveryRequest");
const handleApiError = require("~root/utils/handleAPIError");
const postRecoverRequestSchema = require("./schemas/postRecoveryRequestSchema");
const sendEmail = require("~root/lib/services/emails/sendEmail");

const postRecoveryRequest = async (req, res) => {
  const { requestedEmail } = req.body;
  const URLshortcode = uuidv4(10);

  try {
    await postRecoverRequestSchema.validate(
      { requestedEmail },
      {
        abortEarly: false
      }
    );
    const { requestId } = await createRecoveryRequest({
      requestedEmail,
      URLshortcode
    });
    const emailPayload = {
      to: requestedEmail,
      template: "recovery-email",
      version: "0.0.1",
      metadata: {
        recoveryUrl: `${process.env.APP_BASE_URL}/recover-password/${URLshortcode}`
      }
    };
    sendEmail(emailPayload);

    res.send({
      requestId
    });
  } catch (err) {
    handleApiError(res, err);
  }
};

module.exports = postRecoveryRequest;
