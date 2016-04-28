#!/usr/bin/env node

const wae = require("web-audio-engine");

require("../lib/cli").run(wae, process.argv);
