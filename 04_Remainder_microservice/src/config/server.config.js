const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  PRIVATEJWT: process.env.PRIVATEJWT,
  PRIVATEJWTRefersh: process.env.PRIVATEJWTRefersh,
  INTERNAL_SERVER_TOKEN: process.env.INTERNAL_SERVER_TOKEN,

  EMAIL_ID: process.env.EMAIL_ID,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_SENDER: process.env.EMAIL_SENDER,
  
  REDIS_URL: process.env.REDIS_URL,
  
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  REMAINDER_QUEUE: process.env.REMAINDER_QUEUE,
  
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  FORTEND_URL: process.env.FORTEND_URL, 
  
};
