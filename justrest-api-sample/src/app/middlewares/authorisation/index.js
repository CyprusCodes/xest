const getUserRole = require("./queries/getUserRole");

const authorise = ({ roles: userRolesAllowed }) => async (req, res, next) => {
  const currentUserRole = await getUserRole({ userId: req.user.userId });
  if (userRolesAllowed.includes(currentUserRole)) {
    return next();
  }
  return res.sendStatus(403);
};

module.exports = authorise;
