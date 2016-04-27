"use strict";

function toCliOpt(items) {
  const opts = {};

  opts.option = items[0];
  opts.alias  = items[1];
  opts.type   = items[2];
  opts.description = items[3];

  if (items[4]) {
    opts.default = items[4];
  }

  return opts;
}

const cliOptions = {
  prepend: "wae [options] script-name [-- <args>...]",
  options: [
    //       option           type       description / default
    toCliOpt([ "help"    , "h", "Boolean", "display help" ]),
    toCliOpt([ "version" , "v", "Boolean", "display version" ]),
    toCliOpt([ "type"    , "t", "String" , "file type of audio", "s16" ]),
    toCliOpt([ "rate"    , "r", "Number" , "samplerate of audio", "44100" ]),
    toCliOpt([ "channels", "c", "Number" , "number of channels of audio: e.g. 2 = stereo", "2" ]),
    toCliOpt([ "duration", "d", "Number" , "number of duration for rendering" ]),
    toCliOpt([ "out"     , "o", "String" , "write output to <file>", "speaker" ]),
    toCliOpt([ "verbose" , "V", "Boolean", "run in verbose mode", "false" ])
  ],
  append: "AUDIO FILE FORMAT: s16 s32 u8 raw cd"
};

module.exports = cliOptions;
