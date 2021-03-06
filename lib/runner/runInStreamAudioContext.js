"use strict";

const vm = require("vm");
const consoleAPI = require("../util/consoleAPI");
const timerAPI = require("../util/timerAPI");
const createContextOptions = require("../util/createContextOptions");

function requireIfExists(name) {
  try {
    return require(name);
  } catch (e) {}
  return null;
}

function noop() {}

function runInStreamAudioContext(wae, code, args, opts) {
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

  if (!opts.verbose) {
    consoleAPI.bind(sandbox.console, { "*": noop });
  } else if (opts.out === "stdout") {
    consoleAPI.bind(sandbox.console, { "*": console.error });
  }
  timerAPI.bind(sandbox, global);

  vm.runInNewContext(code, sandbox);

  let promise;

  if (typeof sandbox.module.exports === "function") {
    promise = sandbox.module.exports.apply(null, [ context ].concat(args));
  }
  if (!(promise && typeof promise.then === "function")) {
    promise = Promise.resolve();
  }

  let outStream = process.stdout;

  if (opts.out === "speaker") {
    const Speaker = requireIfExists("speaker");

    if (!Speaker) {
      return Promise.reject(new Error("node-speaker is not installed."));
    }

    outStream = new Speaker(contextOpts);
  }

  process.on("exit", () => {
    context.close();
  });

  promise.then(() => {
    context.pipe(outStream);
    context.resume();
  }).catch(console.error);

  return sandbox;
}

module.exports = { run: runInStreamAudioContext };
