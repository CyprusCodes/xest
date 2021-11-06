const generateAsciiTable = require(".");

it("should generate an ASCII table", () => {
  const output = generateAsciiTable({
    title: "Hello Table",
    columnHeaders: ["Col 1", "Column 2", "Some Other Column"],
    rows: [
      ["162374", "ahskhdfkj", "asdasdf"],
      ["askjdhf", "asdfasdfsa", "asdfasdf"],
      ["what a beatiful table", "cell", "celll"]
    ]
  });

  expect(output).toMatchSnapshot();
});
