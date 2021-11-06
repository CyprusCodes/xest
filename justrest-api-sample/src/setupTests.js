require("module-alias/register");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});
const isUnsafeProdDbConn = require("~root/utils/isUnsafeProdDatabase");

// eslint-disable-next-line no-undef
describe("Database Check", () => {
  const isUnsafe = isUnsafeProdDbConn();
  it("should not run against production database", () => {
    expect(isUnsafe).toBe(false);
  });
});
