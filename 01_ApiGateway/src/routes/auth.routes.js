const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const {userMw} = require("../middlewares/index");
const { AUTH_BACKEND_URL, INTERNAL_SERVER_TOKEN } = require("../serverConfig/server.config");

const router = express.Router();

const authProxy = createProxyMiddleware({
    target: AUTH_BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { "": "" },
    headers: { "x-internal-server-token": INTERNAL_SERVER_TOKEN },
    logLevel: "debug",
});


router.get( "/check", authProxy);
router.post( "/signup", authProxy );
router.post( "/login", authProxy);
router.post( "/refresh-token",  authProxy );  
router.post( "/login/otp", authProxy  );
router.post( "/login/otp-verify", authProxy);
router.post( "/logout",  authProxy );

router.get( "/email/:userId",  authProxy );

//admin/users
router.get( "/users",  userMw.verifyAdmin,  authProxy );
router.get( "/userswithoutfilter",  userMw.verifyAdmin,  authProxy );
router.patch( "/users/update",  userMw.verifyAdmin,  authProxy );
router.patch( "/users/bulkupdate",  userMw.verifyAdmin,  authProxy );

module.exports = router;
