"use strict";

const fs = require("fs");
const optionator = require("optionator")(require("./cli-options"));
const runInRenderingAudioContext = require("./runner/runInRenderingAudioContext");
const runInStreamAudioContext = require("./runner/runInStreamAudioContext");

function showHelp() {
  console.log(optionator.generateHelp());
}

function showVersion() {
  console.log("v" + require("../package").version);
}

function run() {
  const opts = optionator.parse(process.argv);

  if (opts.help) {
    return showHelp();
  }

  if (opts.version) {
    return showVersion();
  }

  const name = opts._.shift();
  const code = fs.readFileSync(name, "utf-8");
  const runner = /^\w+\.\w+$/.test(opts.out) ? runInRenderingAudioContext : runInStreamAudioContext;

  runner(code, opts).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { showHelp, showVersion, run };
