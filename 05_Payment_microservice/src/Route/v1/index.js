const express = require("express");
const router = express.Router();
const path = require('path');

const {eSewaCtrl,khaltiCtrl,stripeCtrl, codCtrl} = require('../../Controllers/index')
const {esewaMw,khaltiMw,stripeMw,internalSvcMw} = require('../../Middlewares/index');



router.get("/check", internalSvcMw.verifyToken ,(req, res) => {
  return res.json({ message: "Payment Server is good to Go" });
});

// esewa 
router.post("/initialize-esewa",internalSvcMw.verifyToken,  esewaMw.intilize, eSewaCtrl.intilizeEsewa);
router.get("/complete-payment",internalSvcMw.verifyToken,  esewaMw.completePayment, eSewaCtrl.completePayment);


// khalti
router.post("/epayment/initiate/", internalSvcMw.verifyToken,khaltiMw.intilize, khaltiCtrl.intilizeKhalti);
router.get("/khalti/complete/payment",internalSvcMw.verifyToken, khaltiMw.completePayment, khaltiCtrl.completePayment);

//stripe 
router.post("/stripe-initiate/",internalSvcMw.verifyToken, stripeMw.intilize, stripeCtrl.intilizeStripe);
router.get("/stripe-complete-payment",internalSvcMw.verifyToken, stripeMw.completePayment, stripeCtrl.completePayment);
router.get("/stripe-failed-payment",internalSvcMw.verifyToken, stripeMw.completePayment, stripeCtrl.failedPayment);

//cod 
router.post("/cod-initiate", internalSvcMw.verifyToken, codCtrl.intilizeCod);

module.exports = router; 