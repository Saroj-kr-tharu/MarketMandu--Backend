const { ClientErrorsCodes, ServerErrosCodes } = require('../Utlis/Errors/https.codes');

class EsewaValidation {

    intilize(req, res, next) {
        const { totalPrice, userEmail } = req.body;

        if (!userEmail || !totalPrice   ) {
            return res.status(ClientErrorsCodes.BAD_REQUEST).json({
                data: {},
                sucess: false,
                message: 'Invalid request  for IntilizeEsewa',
                err: 'Missing mandatory properties to create for a EsewaValidation'
            });
        }
        next();
    }

    completePayment(req, res, next) {
        const data = req.body;
       
        if (!data ) {
            return res.status(ClientErrorsCodes.BAD_REQUEST).json({
                data: {},
                sucess: false,
                message: 'Invalid request  for update completePayment',
                err: 'Missing mandatory properties to update for a EsewaValidation'
            });
        }
        next();
    }

  


}

const eSewaValidation = new EsewaValidation();
module.exports = eSewaValidation;