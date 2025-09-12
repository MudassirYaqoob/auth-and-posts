/* eslint-disable no-undef */
const { hash, compare } = require("bcryptjs");
const { createHmac } = require("crypto");
exports.doHash = (hashVal, saltValue) => {
  const results = hash(hashVal, saltValue);
  return results;
};
exports.doHashValidation = (value, hashedValue) => {
  const results = compare(value, hashedValue);
  return results;
};
exports.hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};
