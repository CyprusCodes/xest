const { exec } = require("child_process");

const runSQL = (sql) => {
  return new Promise((resolve) => {
    console.log(sql);
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

module.exports = runSQL;
