
const {  ServerErrosCodes, SucessCode } = require('./Errors/https.codes'); 

const responseHandler = {
    success: (res, data = {}, message = "Operation successful", statusCode = SucessCode.OK) => {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data
        });
    },
    
    error: (res, message = "Something went wrong", statusCode = ServerErrosCodes.INTERNAL_SERVER_ERROR, data = {}) => {
        return res.status(statusCode).json({
            success: false,
            message: message,
            data: data
        });
    }
};

module.exports = responseHandler;