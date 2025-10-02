/* eslint-disable no-undef */
const joi = require("joi");

exports.signupSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: joi.string().required(),
  // .pattern({)},this is for regex
  //  .message({}) this can be provided in case of showing error message
});
exports.signinSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: joi.string().required(),
});

exports.acceptCodeSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  providedCode: joi.number().required(),
});

exports.changePasswordSchema = joi.object({
  newPassword: joi.string().required(),
  oldPassword: joi.string().required(),
});
