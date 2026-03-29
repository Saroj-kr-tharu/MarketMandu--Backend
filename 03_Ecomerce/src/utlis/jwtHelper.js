
const jwt = require('jsonwebtoken');
const { PRIVATEJWT, PRIVATEJWTRefersh, RefreshPRIVATEJWT } = require("../config/serverConfig");
const {AppError, HttpsStatusCodes} = require('./index')

class JWT {

  async createToken(data, time= '10m') {
    try {

      
      const token = await jwt.sign({ data }, PRIVATEJWT, {
        expiresIn: time, 
      });

      

      return token;
    } catch (error) {
      console.log("Something went wrong in service layer (creating the token)", error);
      throw new AppError(
                        'bcrypt Error',
                        `Creditals invlaid`,
                        'Issue in verify Creaditials  in bcryptHelper in  Bcrypt_helper_class function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
    }
  }


   async createRefreshToken(data, time= '7d') {
    try {
      const token = await jwt.sign({ data }, RefreshPRIVATEJWT, {
        expiresIn: time, 
      });

      return token;
    } catch (error) {
      console.log("Something went wrong in service layer (creating the createRefreshToken)");
      throw new AppError(
                        'createRefreshToken Error',
                        `createRefreshToken invlaid`,
                        'Issue in createRefreshToken  in bcryptHelper createRefreshToken ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
    }
  }


  async verifyToken(token ) {
    try {
      const response = jwt.verify(token, PRIVATEJWT);
      if (!response) throw { error: "Invalid Token  " };

     


      return response;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log("Token has expired");
        throw { error: "TokenExpiredError", message: "Token has expired" };
      } else {
        console.log("Something went wrong in service layer (verify token)");
        throw new AppError(
                        'bcrypt Error',
                        `Creditals invlaid`,
                        'Issue in verify Creaditials  in bcryptHelper in  Bcrypt_helper_class function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
      }
    }
  }


   async verifyRefreshToken(token ) {
    try {
      const response = jwt.verify(token, RefreshPRIVATEJWT);
      if (!response) throw { error: "Refresh Token invalid  " };


      return response;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log("Token has expired");
        throw { error: "TokenExpiredError", message: "Token has expired" };
      } else {
        console.log("Something went wrong in service layer (verify token)");
        throw new AppError(
                        'bcrypt Error',
                        `Creditals invlaid`,
                        'Issue in verify Creaditials  in bcryptHelper in  Bcrypt_helper_class function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
      }
    }
  }
}

const jwt_helper = new JWT();

module.exports = { jwt_helper };
