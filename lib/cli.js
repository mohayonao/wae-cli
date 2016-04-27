"use strict";

const fs = require("fs");
const optionator = require("optionator")(require("./cli-options"));
const toValue = require("./util/toValue");
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
  const args = opts._;
  const code = fs.readFileSync(name);
  const runner = /^\w+\.\w+$/.test(opts.out) ? runInRenderingAudioContext : runInStreamAudioContext;

  runner(code, args, opts).catch(console.error);
}

module.exports = { showHelp, showVersion, run };
