const nestTabularData = require(".");
const testData = require("./testResults.json");

it("should nest tabular result set", () => {
  expect(
    nestTabularData(testData, [
      {
        mergeField: "integration_id",
        childrenLabel: "clientIntegrations",
        fieldsToKeep: ["name", "client_id"]
      },
      {
        mergeField: "client_integration_name",
        childrenLabel: "clientSalesChannels",
        fieldsToKeep: ["status", "token"]
      }
    ])
  ).toMatchSnapshot();
});