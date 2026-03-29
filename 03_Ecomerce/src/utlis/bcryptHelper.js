const bcrypt = require("bcrypt");

const { salt } = require("../config/serverConfig");
const {AppError, HttpsStatusCodes} = require('../utlis/index')

class Bcrypt_helper_class {
  async checkPasswordService(plainpasword, hash) {
    try {

      console.log('data => ', plainpasword, hash)
      const match = bcrypt.compareSync(plainpasword, hash);
      if (!match) 
          throw new AppError(
                        'bcrypt Error',
                        `Creditals invlaid`,
                        ' Creditals invlaid Issue in verify Creaditials  in bcryptHelper in  Bcrypt_helper_class function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
     
      return match;
    } catch (error) {
        console.log(
          "Something went wrong in bcrypt helper layer (checkPasswordService)"
        );
        throw new AppError(
                          'bcrypt Error',
                          `something is wrong`,
                          'Issue in verify Creaditials  in bcryptHelper in  Bcrypt_helper_class function ',
                          HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                      );
      }
  }

  
}

const bcryptHelper = new Bcrypt_helper_class();

module.exports = bcryptHelper;
