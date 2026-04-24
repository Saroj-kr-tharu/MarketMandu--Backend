const {esewaSVC} = require('../Services/index');
const { asyncHandler, responseHandler } = require('../Utlis');
const { SucessCode } = require('../Utlis/Errors/https.codes');

class ESewaController {

    intilizeEsewa = asyncHandler( 
        async (req,res) => {
            const { transactionId, totalPrice, userEmail,orderId } = req.body;
            const data = { amount: totalPrice, userEmail,transactionId, orderId }
            const result = await esewaSVC.intializePaymentService(data);
            return responseHandler.success(res, {...result, ...data}, "Successfully to Intialize esewa Payment", SucessCode.CREATED)
        } 
    );
    
    completePayment = asyncHandler( 
        async (req,res) => {
            const { data } = req.query;
            const result = await esewaSVC.completePaymentService(data);
            if (!result) {
                return res.redirect(302, '/payment-error');
            }
            return res.redirect(302, result);
        } 
    );
   
}

const eSewaController = new ESewaController();
module.exports = eSewaController;