"use strict";

const vm = require("vm");
const wae = require("web-audio-engine");
const consoleAPI = require("../util/consoleAPI");
const timerAPI = require("../util/timerAPI");
const createContextOptions = require("../util/createContextOptions");

function noop() {}

function runInStreamAudioContext(code, opts) {
  const AudioContext = wae.StreamAudioContext;
  const contextOpts = createContextOptions(opts);
  const context = new AudioContext(contextOpts);
  const sandbox = {};

  sandbox.audioContext = context;
  sandbox.require = require;
  sandbox.module  = { exports: {} };
  sandbox.process = Object.assign({}, process);
  sandbox.console = Object.assign({}, console);
  sandbox.global  = Object.assign({}, global);

  if (opts.verbose === true) {
    consoleAPI.bind(sandbox.console, { "*": noop });
  } else if (opts.out === "stdout") {
    consoleAPI.bind(sandbox.console, { "*": console.error });
  }
  timerAPI.bind(sandbox, global);

  vm.runInNewContext(code, sandbox);

  let promise;

  if (typeof sandbox.module.exports === "function") {
    promise = sandbox.module.exports.apply(null, [ context ]);
  }
  if (!(promise && typeof promise.then === "function")) {
    promise = Promise.resolve();
  }

  let outStream = process.stdout;

  if (opts.out === "speaker") {
    outStream = new require("speaker")(contextOpts);
  }

  process.on("exit", () => {
    context.close();
  });

  return promise.then(() => {
    context.pipe(outStream);
    context.resume();
  });
}

module.exports = runInStreamAudioContext;
