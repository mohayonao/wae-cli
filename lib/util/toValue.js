"use strict";

function toValue(value) {
  try {
    return JSON.parse(value);
  } catch (e) {}
  try {
    return eval(`(${value})`);
  } catch (e) {}
  return value;
}

module.exports = toValue;
