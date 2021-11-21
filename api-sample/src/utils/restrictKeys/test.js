const restrictKeys = require(".");

it("should restrict keys", () => {
  const payload = {
    clientId: 123,
    supplierId: 172,
    skus: [
      {
        skuId: 1,
        qty: 4
      }
    ]
  };

  expect(() => restrictKeys(payload, ["clientId", "nonExistentKey"])).toThrow();
  expect(() =>
    restrictKeys(payload, ["nonExistentKey", "nonExistentKey2", "skus"])
  ).toThrow();
});

it("should return original object if no restricted keys are found", () => {
  const payload = {
    supplierId: 172,
    skus: [
      {
        skuId: 1,
        qty: 4
      }
    ]
  };

  expect(restrictKeys(payload, ["clientId", "nonExistentKey"])).toBe(payload);
});
