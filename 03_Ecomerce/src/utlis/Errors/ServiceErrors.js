
const  {ServerErrosCodes}  = require('./https_codes')

class ServiceErrors extends Error { 

    constructor ( 
        name,
        message, 
        explanation, 
        statusCode = ServerErrosCodes.INTERNAL_SERVER_ERROR
    )
    {
        super();
        this.name = 'ServiceError';
        this.message  = message;
        this.explanation = explanation;
        this.statusCode = statusCode
    }


}

module.exports = ServiceErrors;