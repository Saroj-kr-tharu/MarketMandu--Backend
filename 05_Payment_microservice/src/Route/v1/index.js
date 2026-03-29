const express = require("express");
const router = express.Router();
const path = require('path');

const {
    
    eSewaController,
    khaltiController,
    stripeControllers
} = require('../../Controllers/index')

const {
    eSewaValidation,
    khaltiValidation,
    stripeValidation, 
    internalSvcMw
} = require('../../Middlewares/index');
const codController = require("../../Controllers/codControllers");


router.get("/check", internalSvcMw.verifyToken ,(req, res) => {
  return res.json({ message: "Payment Server is good to GO" });
});



// esewa 
router.get("/esewa", function (req, res) {
    const filePath = path.join(__dirname, '../../Utlis/test.html');
    res.sendFile(filePath);
});
router.post("/initialize-esewa",internalSvcMw.verifyToken,  eSewaValidation.intilize, eSewaController.intilizeEsewa);
router.get("/complete-payment",internalSvcMw.verifyToken,  eSewaValidation.completePayment, eSewaController.completePayment);


// khalti
router.post("/epayment/initiate/", internalSvcMw.verifyToken,khaltiValidation.intilize, khaltiController.intilizeKhalti);
router.get("/khalti/complete/payment",internalSvcMw.verifyToken, khaltiValidation.completePayment, khaltiController.completePayment);

//stripe
router.post("/stripe-initiate/",internalSvcMw.verifyToken, stripeValidation.intilize, stripeControllers.intilizeStripe);
router.get("/stripe-complete-payment",internalSvcMw.verifyToken, stripeValidation.completePayment, stripeControllers.completePayment);
router.get("/stripe-failed-payment",internalSvcMw.verifyToken, stripeValidation.completePayment, stripeControllers.failedPayment);

//cod 
router.post("/cod-initiate", internalSvcMw.verifyToken, codController.intilizeCod);



module.exports = router; 