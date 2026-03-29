const sender = require("../config/emailConfig");

const CurdService = require('./curdService')
const  {USER_REPO, OTP_Repo} = require('../repository/index')

const bcryptHelper = require('../utlis/bcryptHelper');
const {jwt_helper} = require('../utlis/jwtHelper');
const {  AppError, HttpsStatusCodes, ServiceError} = require('../utlis/index');
const sendMessageToQueueService = require("./queueService");




class OTPService extends CurdService {
    constructor(){
        super(OTP_Repo)
    }

    async #sendEmail(mailFrom, mailTo, mailSubject, mailBody){
        try {
            const response = await sender.sendMail({
                    from: mailFrom,
                    to: mailTo,
                    subject: mailSubject,
                    html: mailBody,
                    text:"" ,
                });

                return response
        } catch (error) {
            console.log("Something went wrong in email-service");
            throw new AppError(
                        'Send Email Errors',
                        `Failed to send the Email `,
                        'Issue in sending Email  in OTPService in  sendEmail function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
        }

    }
    
    async sendOTP(email){
        try {
           
            // 1. get user info from email 
            // 2. check user is exist 
            // 3. generate otp 
            // 4. add userid and expireat 5 min 
            // 5. create row 
            // 6. send otp 

            const infoUser = await USER_REPO.getByEmail(email);

            if(!infoUser)  
                throw new AppError(
                        'OTP Login Errors',
                        `User with ${email} is not exist`,
                        'Issue in login  in OTPService in  loginOTPservice function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );

            const code = Math.floor(100000 + Math.random() * 900000).toString(); 
            const userId = infoUser?.dataValues?.id;
            const expiresAt =  new Date(Date.now() + 5 * 60 * 1000); // 5 mintues 
                
            await OTP_Repo.create({userId, code, expiresAt})


            // Send OTP 
            

    
             const payload = {
                subject: "Login By OTP",
                content: "code",
                recepientEmail: email,
                notificationTime: new Date(),
                typeMail: "SendOTP",
                username: email ,
                token: code,  
            };
            await sendMessageToQueueService(payload);
            

          
            
            return `OTP sent to ${email}`;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
 
            throw error
        }
    }

    async verifyOTP(email, otp, res){
        try {
           
            // 1. get user info email is exist or not 
            // 1.2 otp convert to hash 
            // 2. get otp is exist or not 
            // 3. verify otp 
            // 3.1 check if the otp exipre date 
            // 4. generate jwt token 
            // 5. update otp date used to true 
            // 6. return jwt token 
            
            const infoUser = await USER_REPO.getByEmail(email);
            if(!infoUser)  
                throw new AppError(
                    'OTP Login Errors',
                    `User with ${email} is not exist`,
                    'Issue in login  in OTPService in  verifyOTP function ',
                    HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
                    
                );
            
            const userId= infoUser?.dataValues?.id;
            
            const otpinfo = await OTP_Repo.getByUserId(userId);
            const expiresAt = otpinfo?.dataValues?.expiresAt;

            console.log(expiresAt)
                
            if(!otpinfo)
                return 'Invalid otp '


            if(new Date() > expiresAt){
                return 'opt Expire'

            }

            const isValid = await bcryptHelper.checkPasswordService(otp, otpinfo?.dataValues?.code);

            if(!isValid)
                 { return 'otp invalid'}
        

            const data = {
                email,
                id: infoUser?.dataValues?.id,
                role: infoUser?.dataValues?.role,
                username: infoUser?.dataValues?.username,
            }


            await OTP_Repo.delete(userId)
            const token = await jwt_helper.createToken(data);


            const refreshToken = await jwt_helper.createRefreshToken({email: data.email, id: data.id,});


            // update refresh token in db 
            await USER_REPO.updateById({refreshToken: refreshToken},data.id );
            

            res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

            
            return {
                ...data,
                token
            };
            

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ", error)
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw error
        }
    }



}

const oTPservice= new OTPService()

module.exports = oTPservice;