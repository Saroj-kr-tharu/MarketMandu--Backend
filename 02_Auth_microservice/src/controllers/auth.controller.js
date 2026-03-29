const {userService, otpService} = require('../services/index');
const sendMessageToQueueService = require('../services/queue.service');
const {SucessCode, ServerErrosCodes} = require('../utlis/Errors/https_codes')

class AuthController { 

    async signup(req,res) {
        try {
            
     
            const data = req?.body;
            const response = await userService.createService(data);

            const payload = {
                userId: response.id,
                email: data.email,
                eventType: 'USER_REGISTERED',
                channel: 'EMAIL',
                referenceType: "USER_REGISTERED",
                payload: {
                    subject: "Welcome To Power11",
                    content: "Reset",
                    username: data.Username || data.email,
                },
                retryCount: 0,
                scheduledAt: new Date(Date.now() + 5 * 60 * 60 * 1000), 
            };
            await sendMessageToQueueService(payload, 'CREATE_NOTIFICATION');
            
            return res.status(SucessCode.OK).json({
                message: "Successfully to Signup",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (signup) ", error )

            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }
    
    async signin(req,res) {
        try {
            
            
            const data = req?.body;
            const response = await userService.loginService(data, res);
            
            return res.status(SucessCode.CREATED).json({
                message: "Successfully to login",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (signup) ", error )
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }
    

    async loginByOTP(req,res) {
        try {
            
            
            const {email} = req?.query;
            const response = await otpService.sendOTP(email);
            
            return res.status(SucessCode.CREATED).json({
                message: "Successfully to Sent OTP ",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (signup) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

    async VerifyOTP(req,res) {
        try {
            
            
            const {email, otp} = req?.query;
            
            const response = await otpService.verifyOTP(email, otp, res);
            
            return res.status(SucessCode.CREATED).json({
                message: "Sucessfully login   ",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (verify OTP) ", error)
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

    async veriyToken(req,res) {
        try {
            
            console.log('heelo')
            const token = req?.headers['x-access-token'];
            const response = await userService.verifyToken(token);

            console.log('response = > ', response)
            
            return res.status(SucessCode.OK).json({
                message: "Successfully to veify Token ",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (verifytoken) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }


    async refreshToken(req,res) {
        try {
            
            
            const oldToken = req.cookies.refreshToken;
            const response = await userService.genRefreshToken(oldToken, res);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully generate new Refresh Token",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (refreshToken) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }


      async logout(req,res) {
        try {
            
            
            const oldToken = req.cookies.refreshToken;

            if(!oldToken){
                    return res.status(SucessCode.OK).json({
                    message: "Already Logout",
                    success: true,
                    data: {},
                    err: {},
                });
            }

            const response = await userService.logout(oldToken, res);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully logout",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (logout) ")
            res.clearCookie("refreshToken");
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

      async getByEmail(req,res) {
        try {
            const {userId} = req?.params; 
            console.log("userId => ", userId)
            const response = await userService.getByData(userId);
            return res.status(SucessCode.OK).json({
                message: "Successfully getByEmail",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (getByEmail) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }


}



const authController = new AuthController();

module.exports = authController;