/* eslint-disable no-undef */

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CODE_SENDER_EMAIL,
    pass: process.env.CODE_EMIAL_PASSWORD,
  },
});

module.exports = transport;
