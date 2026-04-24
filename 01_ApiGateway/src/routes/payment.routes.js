const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const {userMw} = require("../middlewares/index");
const { INTERNAL_SERVER_TOKEN, PAYMENT_BACKEND_URL } = require("../serverConfig/server.config");

const router = express.Router();

const paymentProxy = createProxyMiddleware({
  target: PAYMENT_BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { "": "" },
  headers: { "x-internal-server-token": INTERNAL_SERVER_TOKEN },
  logLevel: "debug", 
});


// check
router.get("/check", paymentProxy); 


// esewa 
router.get("/esewa", userMw.verifyUser,paymentProxy);
router.post("/initialize-esewa",userMw.verifyUser,paymentProxy);
router.get("/complete-payment",paymentProxy);


// khalti
router.post("/epayment/initiate/", userMw.verifyUser,paymentProxy);
router.get("/khalti/complete/payment",paymentProxy);

//stripe
router.post("/stripe-initiate/",userMw.verifyUser,paymentProxy);
router.get("/stripe-complete-payment",paymentProxy);
router.get("/stripe-failed-payment",paymentProxy);

//cod 
router.post("/cod-initiate", userMw.verifyUser,paymentProxy);


module.exports = router;
