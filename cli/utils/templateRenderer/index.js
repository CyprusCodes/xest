const { Liquid } = require("liquidjs");
const engine = new Liquid();
const enrichEngineWithFilter = require("./filters/index");
const enrichEngineWithTags = require("./tags/index");

const render = async (template, context) => {
  enrichEngineWithFilter(engine);
  enrichEngineWithTags(engine);
  return engine.parseAndRender(template, context);
};

module.exports = render;
