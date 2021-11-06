const memoize = require("lodash/memoize");
const jwt = require("jsonwebtoken");
const fetchUserById = require("~root/actions/users/fetchUserById");
const getTestStudentId = require("../getTestStudentId");

const getStudentToken = async userId => {
  if (!userId) {
    // eslint-disable-next-line no-param-reassign
    userId = await getTestStudentId("Ahmet", "Akinsql");
  }

  const { user } = await fetchUserById({ userId });

  const accessToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  return accessToken;
};

module.exports = memoize(getStudentToken, userId => userId);
