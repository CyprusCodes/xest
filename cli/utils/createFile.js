var mkdirp = require("mkdirp");
var fs = require("fs");
var getDirName = require("path").dirname;

function writeFile(path, contents) {
  return mkdirp(getDirName(path)).then((res) => {
    fs.writeFileSync(path, contents);
  });
}

function writeDirectory(path) {
  return mkdirp(getDirName(path)).then((res) => {
    return res;
  });
}

module.exports = { writeFile, writeDirectory };
