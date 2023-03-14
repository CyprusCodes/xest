const express = require("express");
const path = require("path");

const diagram = () => {
  // before starting express server
  // check if our azimutt resources are in-sync with database
  // populate sources
  // remove unrecognized tables and columns from layouts
  // FK, PK, DataType, NULL
  // nice to have: unique constraint, indexes, composite pk
  // update azimutt json

  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "static")));

  // required for hard refresh
  app.get("/00000000-0000-0000-0000-000000000000", (req, res) => {
    res.redirect("/");
  })

  // required for hard refresh
  app.get("/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000", (req, res) => {
    res.redirect("/");
  })

  app.get("/new", (req, res) => {
    res.redirect("/");
  }) 

  app.get("/azimutt.json", (req, res) => {
    // todo serve azimutt.json file from project root directory
    // read latest file from disk each time
    res.send({})
  });

  app.post("/post", (req, res) => {
    // todo
    // save req.body to azimutt.json in project root directory
    console.log(req.body)
    res.send({})
  });

  app.listen(7373, () => {
    console.log("Xest Database Diagram is available on http://localhost:7373");
  });
};

module.exports = {
  diagram,
};
