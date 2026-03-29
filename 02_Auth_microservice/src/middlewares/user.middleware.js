
const {ClientErrorsCodes} = require('../utlis/Errors/https_codes')

class UserMiddleware {

   signupAndLogin  (req, res, next) {
      if (!req.body.email || !req.body.password ) {
        console.log("Something went wrong in auth middleware");
        
        return res.status(ClientErrorsCodes.BAD_REQUEST).json({
          data: {},
          message: "Email or Password is missing  ",
          success: false,
        });
      }

      next();
    };
    
    verifyOTP  (req, res, next) {

       if (!req?.query?.email || !req.query.otp ) {
         console.log("Something went wrong in auth middleware");
         
         return res.status(ClientErrorsCodes.BAD_REQUEST).json({
           data: {},
           message: "otp or email is missing  ",
           success: false,
         });
       }
 
       next();
     };

    verifyToken  (req, res, next)  {
        const token = req?.headers['x-access-token'];
        if (!token ) {
            console.log("token is missing ");
            
            return res.status(ClientErrorsCodes.UNAUTHORISED).json({
            data: {},
            message: "token is missing  ",
            success: false,
            });
        }

      next();
    };
    verifyRefreshToken  (req, res, next)  {

      try {
        
        console.log('d=> ', req.cookies)
        
       const oldToken = req.cookies['refreshToken'];
       
        if (!oldToken ) {
            console.log("No refresh token is missing ");
            
            return res.status(ClientErrorsCodes.UNAUTHORISED).json({
            data: {},
            message: "refresh token is missing  ",
            success: false,
            });
        }

      next();
      } catch (error) {
           return res.status(ClientErrorsCodes.NOT_FOUND).json({
            message: "refresh token is missing ",
            success: false,
          });
          // throw new Error('old token is not found')
      }

        
    };

}





const userMiddlewares = new  UserMiddleware()

module.exports = userMiddlewares; 
