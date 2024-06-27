const refinePath = (path) =>
  // if path contains a directory with whitespace, quote it
  /\s/.test(path)
    ? path
        .split("/")
        .map((dir) => (dir.includes(" ") ? `'${dir}'` : dir))
        .join("/")
    : path;

module.exports = refinePath;
