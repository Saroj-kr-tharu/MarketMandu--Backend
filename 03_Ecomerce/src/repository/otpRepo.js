const CURD_REPO = require("./curdRepo");
const { OTP } = require("../models/index");
const { AppError, HttpsStatusCodes} = require('../utlis/index')

class OTPRepo extends CURD_REPO { 

    constructor(){
        super(OTP)
    }

    async getByUserId (id) { 
        try {
            
             const userOtp = await OTP.findOne({
                    where: { userId: id  },
                    order: [["createdAt", "DESC"]], 
                });

            return userOtp; 
        } catch (error) {
            console.log("something went wrong in Repo otp level (getById) ")
            throw new AppError(
                'RepositoryError',
                'Cannot get BY otphash ',
                'Issue in fetching By otphash in otp REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }


    async delete (id) { 
        try {
              const res = await OTP.destroy({
                    where: {
                    userId:id
                    },
                });
            return res;
        } catch (error) {
            console.log("something went wrong in Repo curd level (delete) ")
            throw new AppError(
                    'RepositoryError',
                    'Cannot delete BY ID ',
                    'Issue in fetching By otphash in otp REPO',
                    HttpsStatusCodes.INTERNAL_SERVER_ERROR

                );
        }
    }

    

}


const oTPRepo = new OTPRepo();

module.exports = oTPRepo;
