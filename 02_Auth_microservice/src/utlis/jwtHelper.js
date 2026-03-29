
const jwt = require('jsonwebtoken');
const { PRIVATEJWT,  RefreshPRIVATEJWT } = require("../config/server.config");


class JWT {

  async createToken(data, time= '10m') {
    try {

      
      const token = await jwt.sign({ data }, PRIVATEJWT, {
        expiresIn: time, 
      });



      return token;
    } catch (error) {
      console.log("Something went wrong in service layer (creating the token)", error);
      throw new Error('Creditals Invalid')
    
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
       throw new Error('createRefreshToken  Invalid')
    
    }
  }


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
      const response = jwt.verify(token, RefreshPRIVATEJWT);
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
