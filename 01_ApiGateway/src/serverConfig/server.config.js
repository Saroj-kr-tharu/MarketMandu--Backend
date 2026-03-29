const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    FORTEND_URL: process.env.FORTEND_URL,
    PORT: process.env.PORT,
    INTERNAL_SERVER_TOKEN: process.env.INTERNAL_SERVER_TOKEN,
    PRIVATEJWT : process.env.PRIVATEJWT,
    ECOMMERCE_BACKEND_URL: process.env.ECOMMERCE_BACKEND_URL,
    PAYMENT_BACKEND_URL: process.env.PAYMENT_BACKEND_URL,
    REMINDER_BACKEND_URL: process.env.REMINDER_BACKEND_URL,
    AUTH_BACKEND_URL: process.env.AUTH_BACKEND_URL,
}