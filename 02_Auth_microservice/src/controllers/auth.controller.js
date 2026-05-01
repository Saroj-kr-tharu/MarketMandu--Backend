const {userService, otpService} = require('../services/index');
const sendMessageToQueueService = require('../services/queue.service');
const { asyncHandler, responseHandler } = require('../utlis');
const {SucessCode, ServerErrosCodes} = require('../utlis/Errors/https_codes')

class AuthController { 
    
    signup = asyncHandler( 
        async (req,res) => {
            const data = req?.body;
            const response = await userService.createService(data);

            const payload = {
                userId: response.id,
                email: data.email,
                role: data.role,
                username: data.username,
                eventType: 'USER_REGISTERED',
                channel: 'EMAIL',
                referenceType: "USER_REGISTERED",
                payload: {
                    subject: "Welcome To MarketMandu", 
                    content: "Reset",
                    username: data.Username || data.email,
                }, 
                retryCount: 0,
                scheduledAt: new Date(Date.now() + 5 * 60 * 60 * 1000), 
            };
            await sendMessageToQueueService(payload, 'CREATE_NOTIFICATION');

            const Userpayload = {
                userId: response.id,
                email: data.email,
                role: data.role,
                username: data.username,
                eventType: 'USER_REGISTERED',
            };
            await sendMessageToQueueService(Userpayload, 'USER_EVENT_EMIT');
            return responseHandler.success(res, response, "Successfully Register User", SucessCode.CREATED)
        } 
    );

    signin = asyncHandler( 
        async (req,res) => {
            const data = req?.body;
            const response = await userService.loginService(data, res);
            // console.log("login data => ", response)
            return responseHandler.success(res, response, "Successfully to login", SucessCode.OK)
        } 
    );

    veriyToken = asyncHandler( 
        async (req,res) => {
            const token = req?.headers['x-access-token'];
            const response = await userService.verifyToken(token);
            return responseHandler.success(res, response, "Successfully Verify Token", SucessCode.OK)
        } 
    );
    
    refreshToken = asyncHandler( 
        async (req,res) => {
            const oldToken = req.cookies.refreshToken;
            const response = await userService.genRefreshToken(oldToken, res);
            return responseHandler.success(res, response, "Successfully generate new Refresh Token", SucessCode.OK)
        } 
    );
    
    logout = asyncHandler( 
        async (req,res) => {
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
            return responseHandler.success(res, response, "Successfully logout", SucessCode.OK)
        } 
    );

    getByEmail = asyncHandler( 
        async (req,res) => {
            const {userId} = req?.params; 
            // console.log("userId = > ", userId)
            const response = await userService.getByData(userId);
            return responseHandler.success(res, response, "Successfully getByEmail", SucessCode.OK)
        } 
    );


    // admin users 
    getAllUserWithoutFilter = asyncHandler( 
        async (req,res) => {
            const response = await userService.getAllUserWithoutFilterPagtion(); 
            return responseHandler.success(res, response, "Successfully fetched all users", SucessCode.OK)
        } 
    );

    updateUserById = asyncHandler( 
        async (req,res) => {
            const {id} = req?.query;
            const data =req.body;
            const response = await userService.userUpdateById(data, id);
            const payload = {
                id:id,
                data: data,
                eventType: 'UPDATE_USER_SINGLE',
                
            };
            await sendMessageToQueueService(payload, 'USER_EVENT_EMIT');
            return responseHandler.success(res, response, "Successfully Update user with id", SucessCode.OK)
        } 
    );


    BulkupdateUsers = asyncHandler( 
        async (req,res) => {
            const {ids} =req.body;
            // console.log('ids => ', ids)
            const response = await userService.bulkUpdateUserId(ids);
            const payload = {
                ids:ids,
                eventType: 'UPDATE_USER_BULK',
            };
            await sendMessageToQueueService(payload, 'USER_EVENT_EMIT');
            return responseHandler.success(res, response, "Successfully Bulk Update user with ids", SucessCode.OK)
        } 
    );

    getAllUsers = asyncHandler( 
        async (req,res) => {
            const {page,limit,email,role,username} = req?.query;
            const data = {
                email: email || null,
                role: role || null,
                username: username || null,
            };
            const response = await userService.getAllUserPagtion(parseInt(page),parseInt(limit),data);
            return responseHandler.success(res, response, "Successfully fetched all users", SucessCode.OK)
        } 
    );
    


}



const authController = new AuthController();
module.exports = authController;