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
    APIGATEWAY_BACKEND_URL:  process.env.APIGATEWAY_BACKEND_URL,
    FORTEND_SUCESS_URL:  process.env.FORTEND_SUCESS_URL,

    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    CHANNEL_NAME: process.env.CHANNEL_NAME,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
    ECOOMERCE_QUEUE: process.env.ECOOMERCE_QUEUE,


    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESSKEYID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRECT_ACESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    BUCKET_NAME:  process.env.BUCKET_NAME,

    CLOUDFRONT_DOMAIN:  process.env.CLOUDFRONT_DOMAIN,
    CLOUDFRONT_PRIVATE_KEY:  process.env.CLOUDFRONT_PRIVATE_KEY,
    CLOUDFRONT_KEY_PAIR_ID:  process.env.CLOUDFRONT_KEY_PAIR_ID,
  
  

}