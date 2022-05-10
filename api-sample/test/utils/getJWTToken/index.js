const memoize = require("lodash/memoize");
const jwt = require("jsonwebtoken");
const fetchUserById = require("~root/actions/users/fetchUserById");

const getJWT = async (userId = 1) => {
  const { user } = await fetchUserById({ userId });

  const accessToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  return accessToken;
};

module.exports = memoize(getJWT, userId => userId);
