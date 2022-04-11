const { execSync } = require("child_process");

const isAppleSilicon = () => {
  const isMac = process.platform === "darwin";
  if (isMac) {
    const cpuArchitecture = execSync(
      `sysctl -n machdep.cpu.brand_string`
    ).toString();
    return cpuArchitecture.toLowerCase().includes("apple m");
  }

  return false;
};

module.exports = isAppleSilicon;
