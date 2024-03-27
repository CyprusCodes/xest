const createUser = require("~root/actions/users/createUser");
const handleAPIError = require("~root/utils/handleAPIError");
const postUserSchema = require("./schemas/postUserSchema");

const postUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    currentSituation,
    isEmployed
  } = req.body;

  try {
    await postUserSchema.validate(
      {
        firstName,
        lastName,
        email,
        password,
        currentSituation,
        isEmployed
      },
      {
        abortEarly: false
      }
    );

    const { userId } = await createUser({
      firstName,
      lastName,
      email,
      password,
      currentSituation,
      isEmployed
    });

    res.status(201).send({
      userId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postUser;
