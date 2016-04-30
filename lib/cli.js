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
  console.log("wae-cli: v" + require("../package").version);
  console.log("web-audio-engine: v" + require("../node_modules/web-audio-engine/package").version);
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

  return runner.run(wae, code, args, opts);
}

module.exports = { showHelp, showVersion, run };
