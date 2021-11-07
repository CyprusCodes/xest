const { exec } = require("child_process");

const runSqlQueryWithinContainer = sql => {
  return new Promise(resolve => {
    exec(sql, (error, output) => {
      if (error) {
        error = error.toString();
      }

      resolve({
        error,
        output
      });
    });
  });
};

module.exports = runSqlQueryWithinContainer;
