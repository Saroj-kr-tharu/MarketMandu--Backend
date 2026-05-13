
const {responseHandler} = require('../Utlis/index');
const {ClientErrorsCodes,ServerErrosCodes} = require("../Utlis/Errors/https.codes")

const errorMiddleware = (err, req, res, next) => {
    console.log(err)
    // Custom Error
    if (err.statusCode) {
        return responseHandler.error(
            res,
            err.message,
            err.statusCode,
            { explanation: err.explanation }
        );
    }

    //  Sequelize  Error 
    if (err.name === 'SequelizeUniqueConstraintError') {
        const messages = err.errors.map((e) => `${e.path}: ${e.message}`).join(', ');
        return responseHandler.error(res, messages, ClientErrorsCodes.CONFLICT);
    }

    
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map((e) => `${e.path}: ${e.message}`).join(', ');
        return responseHandler.error(res, messages, ClientErrorsCodes.BAD_REQUEST);
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return responseHandler.error(res, 'Invalid reference: related record not found', ClientErrorsCodes.BAD_REQUEST);
    }

    if (err.name === 'SequelizeDatabaseError') {
        return responseHandler.error(res, 'Database error occurred', ServerErrosCodes.INTERNAL_SERVER_ERROR);
    }

    
    // back to normal global error 
    return responseHandler.error(res, "Something went wrong");
};

module.exports = errorMiddleware;