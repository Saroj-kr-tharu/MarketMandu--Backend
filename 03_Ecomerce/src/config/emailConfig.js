const nodemailer = require("nodemailer");
const { EMAIL_ID, EMAIL_PASSWORD } = require("../config/serverConfig");

// console.log("Email id ==> ", EMAIL_ID, "email pass => ", EMAIL_PASSWORD);

const sender = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_PASSWORD,
  },
});

module.exports = sender;
