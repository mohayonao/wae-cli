"use strict";

const API_KEYS = [ "log", "info", "warn", "error" ];

function bind(api, consoleAPI) {
  API_KEYS.forEach((key) => {
    if (typeof consoleAPI[key] === "function") {
      api[key] = consoleAPI[key];
    } else if (typeof consoleAPI["*"] === "function") {
      api[key] = consoleAPI["*"];
    }
  });
  return api;
}

module.exports = { bind };
