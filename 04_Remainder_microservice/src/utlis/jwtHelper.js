
const jwt = require('jsonwebtoken');
const { PRIVATEJWT,  PRIVATEJWTRefersh } = require("../config/server.config");


class JWT {


  async verifyToken(token ) {
    try {
      const response = jwt.verify(token, PRIVATEJWT);
      if (!response) throw   new Error('Invalid Token ')
      return response;
    } catch (error) {
      throw error;
    }
  }


   async verifyRefreshToken(token ) {
    try {
      const response = jwt.verify(token, PRIVATEJWTRefersh);
      if (!response) throw new Error ("Refresh Token invalid  ");
      return response;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error ("Token has expired  ");
      } else {
        console.log("Something went wrong in service layer (verify token)");
         throw error;
      }
    }
  }
}

const jwt_helper = new JWT();
module.exports = jwt_helper ;
