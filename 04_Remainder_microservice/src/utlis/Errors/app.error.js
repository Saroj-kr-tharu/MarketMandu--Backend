const {ServerErrosCodes}  = require('./https_codes')

class AppError extends Error { 
    constructor(
        name,
        message, 
        explanation, 
        statusCode = ServerErrosCodes.INTERNAL_SERVER_ERROR
    )
    {
        super();
        this.name = name ; 
        this.message = message;
        this.explanation = explanation; 
        this.statusCode = statusCode;
    }
}


module.exports = AppError