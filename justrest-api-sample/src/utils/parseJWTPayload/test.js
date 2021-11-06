const parseJWTPayload = require(".");

it("should extract payload as an object from a valid token", () => {
  const TEST_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const payload = parseJWTPayload(TEST_JWT);
  expect(payload).toEqual({
    iat: 1516239022,
    name: "John Doe",
    sub: "1234567890"
  });
});

it("should return empty object if token is not valid/malformed", () => {
  const TEST_JWT = "NOT-A-VALID-TOKEN";
  const payload = parseJWTPayload(TEST_JWT);
  expect(payload).toEqual({});
});
