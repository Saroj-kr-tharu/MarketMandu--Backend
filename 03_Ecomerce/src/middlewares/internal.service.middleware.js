
const {  ClientErrorsCodes } = require('../utlis/Errors/https_codes');
const {INTERNAL_SERVER_TOKEN} = require('../config/serverConfig')

class InternalServiceMiddleware {
    
   verifyToken(req, res, next) {
     

      if (!req.headers["x-internal-server-token"]) {
        //   console.log("Try to access without Internal Service Token");
          return res.status(ClientErrorsCodes.FORBIDDEN).json({ message: "Forbidden", success: false });
      }

      if (req.headers["x-internal-server-token"] != INTERNAL_SERVER_TOKEN) {
        //   console.log("Try to access with modified token");
          return res.status(ClientErrorsCodes.UNAUTHORIZED).json({ message: "Unauthorized", success: false });
      }

      next();
  }
    
   

}





const internalServiceMiddleware = new  InternalServiceMiddleware()

module.exports = internalServiceMiddleware; 
