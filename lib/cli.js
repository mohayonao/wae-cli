"use strict";

const optionator = require("optionator")(require("./cli-options"));
const readFileSync = require("./util/readFileSync");
const toValue = require("./util/toValue");
const runInRenderingAudioContext = require("./runner/runInRenderingAudioContext");
const runInStreamAudioContext = require("./runner/runInStreamAudioContext");

function showHelp() {
  console.log(optionator.generateHelp());
}

function showVersion() {
  console.log("v" + require("../package").version);
}

function run(wae, argv, util) {
  const opts = optionator.parse(argv);

  if (opts.help) {
    return showHelp();
  }

  if (opts.version) {
    return showVersion();
  }

  const name = opts._.shift();
  const args = opts._.concat(util);
  const code = readFileSync(name);
  const runner = /^\w+\.\w+$/.test(opts.out) ? runInRenderingAudioContext : runInStreamAudioContext;

  runner(wae, code, args, opts).catch(console.error);
}

module.exports = { showHelp, showVersion, run };
