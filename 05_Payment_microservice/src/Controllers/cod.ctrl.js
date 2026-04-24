const { MARKETMANDU_URL, PAYMENT_BACKEND_URL } = require('../config/serverConfig');
const {codSvc} = require('../Services/index');
const { asyncHandler, responseHandler } = require('../Utlis');
const { SucessCode } = require('../Utlis/Errors/https.codes');

class CodController {
    intilizeCod = asyncHandler( 
        async (req,res) => {
            const data = req.body;
            const result = await codSvc.intializePaymentService(data);
            return responseHandler.success(res, result, "Successfully to add products", SucessCode.CREATED)
        } 
    );
}


const codController = new CodController();
module.exports = codController;