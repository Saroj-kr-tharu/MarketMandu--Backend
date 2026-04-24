const express = require('express');
const router = express.Router();

const {authCtrl } = require('../../controllers/index')
const {userMw, internalSvcMw} = require('../../middlewares/index')


router.get("/check", internalSvcMw.verifyToken , (req, res) => {
  return res.json({ message: "Auth Server  is good to Go " });
});


// user 
router.post( "/signup",internalSvcMw.verifyToken, userMw.signupAndLogin, authCtrl.signup );
router.post( "/login",internalSvcMw.verifyToken, userMw.signupAndLogin, authCtrl.signin );
router.get( "/veriyToken",internalSvcMw.verifyToken, userMw.verifyToken, authCtrl.veriyToken );
router.post( "/refresh-token",internalSvcMw.verifyToken,  authCtrl.refreshToken );
router.post( "/logout", internalSvcMw.verifyToken, authCtrl.logout );

router.get( "/email/:userId", internalSvcMw.verifyToken, authCtrl.getByEmail );
 
// admin /users 
router.get( "/users", internalSvcMw.verifyToken , authCtrl.getAllUsers );
router.get( "/userswithoutfilter", internalSvcMw.verifyToken ,  authCtrl.getAllUserWithoutFilter );
router.patch( "/users/update", internalSvcMw.verifyToken ,  authCtrl.updateUserById );
router.patch( "/users/bulkupdate", internalSvcMw.verifyToken ,  authCtrl.BulkupdateUsers );

 
module.exports = router;