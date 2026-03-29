const express = require('express');
const router = express.Router();

const {authCtrl } = require('../../controllers/index')
const {userMw, internalSvcMw} = require('../../middlewares/index')


router.get("/check", internalSvcMw.verifyToken , (req, res) => {
  return res.json({ message: "Auth Server is good to GO" });
});


// user 
router.post( "/signup",internalSvcMw.verifyToken, userMw.signupAndLogin, authCtrl.signup );
router.post( "/login",internalSvcMw.verifyToken, userMw.signupAndLogin, authCtrl.signin );
router.get( "/veriyToken",internalSvcMw.verifyToken, userMw.verifyToken, authCtrl.veriyToken );
router.post( "/refresh-token",internalSvcMw.verifyToken, userMw.verifyRefreshToken, authCtrl.refreshToken );
router.post( "/login/otp",internalSvcMw.verifyToken, authCtrl.loginByOTP );
router.post( "/login/otp-verify",internalSvcMw.verifyToken, userMw.verifyOTP, authCtrl.VerifyOTP );
router.post( "/logout", internalSvcMw.verifyToken, authCtrl.logout );
router.get( "/email/:userId", internalSvcMw.verifyToken, authCtrl.getByEmail );

 
 
module.exports = router;