const dotenv = require('dotenv')
const bcrypt = require('bcrypt')

dotenv.config()

module.exports = { 
    PORT  : process.env.PORT,
    salt: bcrypt.genSaltSync(10),
    PRIVATEJWT: process.env.PRIVATEJWT,
    RefreshPRIVATEJWT: process.env.PRIVATEJWTRefersh,
    INTERNAL_SERVER_TOKEN: process.env.INTERNAL_SERVER_TOKEN,
    
    EMAIL_ID: process.env.EMAIL_ID,
    EMAIL_PASSWORD: process.env.EMAIL_PASS,

    PAYMENT_BACKEND_URL:  process.env.PAYMENT_BACKEND_URL,
    FORTEND_SUCESS_URL:  process.env.FORTEND_SUCESS_URL,

    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    CHANNEL_NAME: process.env.CHANNEL_NAME,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,

}