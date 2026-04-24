const { ClientErrorsCodes, ServerErrosCodes } = require('../Utlis/Errors/https.codes');

class KhaltiValidation {

    intilize(req, res, next) {
         const {transactionId,return_url,website_url,amount, purchase_order_id,purchase_order_name ,customer_info} = req.body;
        // console.log('data => ', req.body); 
  
        
        if (!transactionId || !return_url || !website_url || !amount || !purchase_order_id || !purchase_order_name || !customer_info  ) {
            return res.status(ClientErrorsCodes.BAD_REQUEST).json({
                data: {},
                sucess: false,
                message: 'Invalid request  for IntilizeKhalti',
                err: 'Missing mandatory properties to create for a khaltiValidation'
            });
        }
        next(); 
    }

    completePayment(req, res, next) {
         const { pidx } = req.query;
       
        if (!pidx ) {
            return res.status(ClientErrorsCodes.BAD_REQUEST).json({
                data: {},
                sucess: false,
                message: 'Invalid request  for update completePayment',
                err: 'Missing mandatory properties to update for a khaltiValidation'
            });
        }
        next();
    }

  


}

const khaltiValidation = new KhaltiValidation();
module.exports = khaltiValidation;