const { MARKETMANDU_URL, PAYMENT_BACKEND_URL } = require('../config/serverConfig');
const {khaltiSVC} = require('../Services/index');
const { asyncHandler, responseHandler } = require('../Utlis');
const { SucessCode, ServerErrosCodes } = require('../Utlis/Errors/https.codes');

class KhaltiController {

    intilizeKhalti = asyncHandler( 
        async (req,res) => {
            const data = req.body;
            const payload = { 
                return_url: `${PAYMENT_BACKEND_URL}/khalti/complete/payment?transId=${encodeURIComponent(data.transactionId)}`,
                website_url: data.website_url || "https://www.fortend.com",
                amount: parseInt(data.amount, 10), 
                purchase_order_id: data.purchase_order_id,
                purchase_order_name: data.purchase_order_name,
                customer_info: data.customer_info, 
                orderId: data.purchase_order_id
            }
            const result = await khaltiSVC.intializePaymentService(payload);
            return responseHandler.success(res, result, "Successfully to intilizeKhalti Payment", SucessCode.CREATED)
        } 
    );

    completePayment = asyncHandler( 
        async (req,res) => {
            const { pidx,  } = req.query;
            const data = {pidx}
            const result = await khaltiSVC.completePaymentService(data);
            res.redirect(result);
        } 
    );
   
    failedPayment = asyncHandler( 
        async (req,res) => {
            return responseHandler.success(res, result, "Failed Khalti Payment", ServerErrosCodes.INTERNAL_SERVER_ERROR)
        } 
    );

}


const khaltiController = new KhaltiController();
module.exports = khaltiController;