const plur = require(".");

it("should pluralize correctly", () => {
  let count = 0;
  expect(plur({ count, singular: "apple", plural: "apples" })).toBe("0 apples");

  count = 1;
  expect(plur({ count, singular: "apple", plural: "apples" })).toBe("1 apple");

  count = 2;
  expect(plur({ count, singular: "apple", plural: "apples" })).toBe("2 apples");

  count = -5;
  expect(plur({ count, singular: "apple", plural: "apples" })).toBe(
    "-5 apples"
  );

  count = -1;
  expect(plur({ count, singular: "apple", plural: "apples" })).toBe("-1 apple");

  count = -1;
  expect(
    plur({ count, singular: "apple", plural: "apples", showCount: false })
  ).toBe("apple");
});

it("should handle {count} inline", () => {
  expect(
    plur({
      count: 1,
      singular: "was an apple",
      plural: "were {count} apples"
    })
  ).toBe("was an apple");

  expect(
    plur({
      count: 5,
      singular: "was an apple",
      plural: "were {count} apples"
    })
  ).toBe("were 5 apples");
});
