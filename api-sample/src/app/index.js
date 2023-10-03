require("module-alias/register");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const monitoring = require("~root/utils/monitoring");
const qs = require("qs");
// prevent running against production database by mistake
require("~root/utils/exitIfProductionDatabase")();

const port = process.env.PORT || 3001;
const app = express();
// see https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);
app.set("query parser", function parseQueryString(str) {
  return qs.parse(str, {
    arrayLimit: 50,
    depth: 20
  });
});
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(morgan("combined", { stream: monitoring.stream }));

if (process.env.APP_ENVIRONMENT === "PRODUCTION") {
  // 30 requests per minute per IP
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60 // limit each IP to 30 requests per windowMs
  });
  app.use(limiter);
}

const router = require("./routes");

app.use(router);

app.listen(port, () => monitoring.log(`API listening on port ${port}!`));

module.exports = app;
