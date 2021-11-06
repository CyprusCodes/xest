const url = require("url");

const parseMySQLConnString = connString => {
  const parsedURL = new url.URL(connString);
  return {
    host: parsedURL.hostname,
    user: parsedURL.username,
    password: parsedURL.password,
    database: parsedURL.pathname.slice(1)
  };
};

module.exports = parseMySQLConnString;
