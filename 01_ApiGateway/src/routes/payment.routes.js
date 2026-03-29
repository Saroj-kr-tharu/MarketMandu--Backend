const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const {userMw} = require("../middlewares/index");
const { INTERNAL_SERVER_TOKEN, PAYMENT_BACKEND_URL } = require("../serverConfig/server.config");

const router = express.Router();

const paymentProxy = createProxyMiddleware({
  target: PAYMENT_BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { "^/payment": "" },
  headers: { "x-internal-server-token": INTERNAL_SERVER_TOKEN },
  logLevel: "debug", 
});



// khalti 
router.get("/khalti/complete/payment",paymentProxy);

//stripe
router.get("/stripe-complete-payment",paymentProxy);
router.get("/stripe-failed-payment",paymentProxy);

// payment
router.post("/initialize", userMw.verifyUser,paymentProxy);

router.get("/wallet", userMw.verifyUser,paymentProxy);

router.get("/wallet/transactions", userMw.verifyUser,paymentProxy);

router.post("/withdrawals/request",  userMw.verifyUser,paymentProxy);
router.get("/withdrawals", userMw.verifyUser,paymentProxy);

router.get("/withdrawal/:requestId",  userMw.verifyUser,paymentProxy);

router.patch("/withdrawal/:requestId", userMw.verifyAdmin,paymentProxy);




module.exports = router;
