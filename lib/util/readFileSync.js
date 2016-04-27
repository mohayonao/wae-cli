"use strict";

const fs = require("fs");

function readFileSync(filepath) {
  try {
    return fs.readFileSync(filepath, "utf-8");
  } catch (e) {}
  return fs.readFileSync(filepath + ".js", "utf-8");
}

module.exports = readFileSync;
