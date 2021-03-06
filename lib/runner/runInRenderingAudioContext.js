"use strict";

const vm = require("vm");
const fs = require("fs");
const tickable = require("tickable-timer");
const timerAPI = require("../util/timerAPI");
const consoleAPI = require("../util/consoleAPI");
const createContextOptions = require("../util/createContextOptions");

function noop() {}

function runInRenderingAudioContext(wae, code, args, opts) {
  const AudioContext = wae.RenderingAudioContext;
  const context = new AudioContext(createContextOptions(opts));
  const sandbox = {};

  sandbox.audioContext = context;
  sandbox.require = require;
  sandbox.module  = { exports: {} };
  sandbox.process = Object.assign({}, process);
  sandbox.console = Object.assign({}, console);
  sandbox.global  = Object.assign({}, global);

  if (!opts.verbose) {
    consoleAPI.bind(sandbox.console, { "*": noop });
  }
  timerAPI.bind(sandbox, tickable);
  timerAPI.bind(sandbox.global, tickable);

  vm.runInNewContext(code, sandbox);

  let promise;

  if (typeof sandbox.module.exports === "function") {
    promise = sandbox.module.exports.apply(null, [ context ].concat(args));
  }
  if (!(promise && typeof promise.then === "function")) {
    promise = Promise.resolve();
  }

  sandbox.process.exit = (code) => {
    code = code|0;

    if (code === 0) {
      opts.exit = true;
      exportAsFile(context, opts).then(() => {
        context.close();
        process.exit(0);
      });
    } else {
      context.close();
      process.exit(code);
    }
  };

  promise.then(() => {
    return render(context, opts);
  }).catch(console.error);

  return sandbox;
}

function render(context, opts) {
  const duration = Math.max(0, opts.duration) || 10;
  const iterations = Math.ceil((duration * context.sampleRate) / context.blockSize);
  const processingTimeInFrame = context.blockSize / context.sampleRate;

  for (let i = 0; i < iterations && !opts.exit; i++) {
    tickable.tick(processingTimeInFrame * 1000);
    context.processTo(processingTimeInFrame * i);
  }

  if (!opts.exit) {
    return exportAsFile(context, opts);
  }
}

function exportAsFile(context, opts) {
  const outputFilename = opts.out || "out.wav";
  const audioData = context.exportAsAudioData();

  return context.encodeAudioData(audioData).then((arrayBuffer) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(outputFilename, new Buffer(arrayBuffer), (err) => {
        (err ? reject : resolve)();
      });
    });
  });
}

module.exports = { run: runInRenderingAudioContext };
