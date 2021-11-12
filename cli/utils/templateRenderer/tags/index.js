// Usage: {% sql %}
// Adapted from builtin tablerow tag
// https://github.com/harttle/liquidjs/blob/master/src/builtin/tags/tablerow.ts
const { format } = require("sql-formatter");

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

const registerTags = function (engine) {
  engine.registerTag("sql", {
    parse: function (tagToken, remainTokens) {
      this.templates = [];
      let p;
      const stream = this.liquid.parser
        .parseStream(remainTokens)
        .on("start", () => (p = this.templates))
        .on("tag:endsql", () => stream.stop())
        .on("template", (tpl) => p.push(tpl))
        .on("end", () => {
          throw new Error(`sql ${tagToken.getText()} not closed`);
        });

      stream.start();
    },
    render: async function (ctx, emitter) {
      const r = this.liquid.renderer;
      const stream = r.renderTemplatesToNodeStream(
        this.templates,
        ctx,
        emitter
      );
      const out = await streamToString(stream);
      return `${format(out)
        .split("\n")
        .map((i) => `  ${i}`)
        .join("\n")
        .replace(/\$\s\{/g, "${")}`
        .replace(/\${\s(.+)\s}/g, "${$1}");
    },
  });
};

module.exports = registerTags;
