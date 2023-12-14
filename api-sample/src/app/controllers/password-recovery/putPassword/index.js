const modifyPassword = require("~root/actions/password-recovery/modifyPassword");
const handleApiError = require("~root/utils/handleAPIError");
const putPasswordSchema = require("./schemas/putPasswordSchema");
const modifyRecoveryDate = require("~root/actions/password-recovery/modifyRecoveryDate");
const fetchRecoveryRequest = require("~root/actions/password-recovery/fetchRecoveryRequest");

const putPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const { shortcode } = req.params;

  try {
    const { requestedEmail } = await fetchRecoveryRequest({ email, shortcode });

    await putPasswordSchema.validate(
      { email, password, confirmPassword, requestedEmail },
      {
        abortEarly: false
      }
    );

    const { userId } = await modifyPassword({
      email,
      password
    });
    res.send({
      userId
    });
    await modifyRecoveryDate({ email });
  } catch (err) {
    handleApiError(res, err);
  }
};

module.exports = putPassword;
