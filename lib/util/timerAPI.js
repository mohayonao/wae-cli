"use strict";

const API_KEYS = [ "setInterval", "clearInterval", "setTimeout", "clearTimeout" ];

function bind(api, timerAPI) {
  API_KEYS.forEach((key) => {
    if (typeof timerAPI[key] === "function") {
      api[key] = timerAPI[key];
    }
  });
  return api;
}

module.exports = { bind };
