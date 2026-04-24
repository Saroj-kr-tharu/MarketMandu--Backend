const { ServerErrosCodes, SucessCode } = require('../Utlis/Errors/https.codes')
const {stripeSVC} = require('../Services/index');
const { asyncHandler, responseHandler } = require('../Utlis');

class StripeControllers {

    intilizeStripe = asyncHandler( 
        async (req,res) => {
            let { transactionId, items, amount, userEmail, orderId } = req.body;
            const data = { items, amount, userEmail, transactionId ,orderId };
            const result = await stripeSVC.intializePaymentService(data)
            return responseHandler.success(res, result, "Successfully to Intialize Payment Stripe ", SucessCode.OK)
        } 
    );
    
    completePayment = asyncHandler( 
        async (req,res) => {
            const { session_id, transId } = req.query;
            const result = await stripeSVC.completePaymentService(session_id, transId);
            if (!result) {return res.redirect(302, '/payment-error'); }
            return res.redirect(302, result);
        } 
    );
    
    failedPayment = asyncHandler( 
        async (req,res) => {
            const { session_id } = req.query;
            await stripeSVC.failedPaymentService(session_id);
            return responseHandler.success(res, result, "Failed Payment Stripe ", SucessCode.OK)
        } 
    );



}


const stripeControllers = new StripeControllers();

module.exports = stripeControllers;