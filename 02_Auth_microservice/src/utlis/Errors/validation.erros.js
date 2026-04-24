const  { ClientErrorsCodes}  = require('./https_codes')

class ValidationErrors extends Error {

    constructor(error){
        super();

        let explanation = [];

        error.errors.forEach( (err) => {
            explanation.push(err.message);
        } );

            this.name = 'ValidationError',
            this.message = "Not Able to Validate the data sent  in the request",
            this.explanation = explanation,
            this.statusCode = ClientErrorsCodes.BAD_REQUEST
    }
}


module.exports = ValidationErrors;