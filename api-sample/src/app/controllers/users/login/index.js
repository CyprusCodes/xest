const jwt = require("jsonwebtoken");
const fetchUser = require("~root/actions/users/fetchUser");

const login = async (req, res) => {
  const { email, password } = req.body;

  const { user } = await fetchUser({ email, password });

  if (user) {
    const accessToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: "365d" // 1 year
    });

    res.json({
      accessToken
    });
  } else {
    res.status(401).send("Username or password incorrect");
  }
};

module.exports = login;
