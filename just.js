#!/usr/bin/env node
const program = require("commander");
const { description, version } = require("./package.json");

const { generate } = require("./cli");

program
  .command("start [appname]", { isDefault: true })
  .description("scaffold a new justrest API project")
  .action(generate(program));

/*
program
  .command("new [type]", { isDefault: true })
  .description("create new resource")
  .action(generate(program));
*/

program
  .description(description)
  .version(version, "-v, --version")
  .parse(process.argv);
