const bcrypt = require("bcrypt");


class Bcrypt_helper_class {
  async checkPasswordService(plainpasword, hash) {
    try {

      console.log('data => ', plainpasword, hash)
      const match = bcrypt.compareSync(plainpasword, hash);
      if (!match) 
        throw new Error('Creditals Invalid')
        
     
      return match;
    } catch (error) {
        console.log("Something went wrong in bcrypt helper layer (checkPasswordService)");
        throw new Error('Something is wrong in bcrypt Error')
      
      }
  }

  
}

const bcryptHelper = new Bcrypt_helper_class();
module.exports = bcryptHelper;
