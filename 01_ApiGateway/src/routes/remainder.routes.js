const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const {userMw} = require("../middlewares/index");
const { REMINDER_BACKEND_URL, INTERNAL_SERVER_TOKEN } = require("../serverConfig/server.config");

const router = express.Router();

const remainderProxy = createProxyMiddleware({
  target: REMINDER_BACKEND_URL,
  changeOrigin: true,
   pathRewrite: { "^/remainder": "" },
  headers: { "x-internal-server-token": INTERNAL_SERVER_TOKEN },
  logLevel: "debug",
});

 
router.post("/template", userMw.verifyAdmin,  remainderProxy);
router.delete("/template/:templateId",   userMw.verifyAdmin,  remainderProxy);
router.patch("/template/:templateId",  userMw.verifyAdmin,  remainderProxy);
router.get("/template",  userMw.verifyAdmin,  remainderProxy);


module.exports = router;
