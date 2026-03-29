const CurdService = require('./curdService')
const  USER_REPO = require('../repository/userRepo')
const  cartRepo = require('../repository/cartRepo')

const bcryptHelper = require('../utlis/bcryptHelper');
const {jwt_helper} = require('../utlis/jwtHelper');
const {  ServiceError} = require('../utlis/index');
const { RefreshPRIVATEJWT } = require('../config/serverConfig');

class userService extends CurdService {
    constructor(){
        super(USER_REPO)
    }

    
    async loginService(data, res){
        try {
            const {password, email} = data;
            const infoUser = await USER_REPO.getByEmail(email);

            

           

            const hashpassword = infoUser?.dataValues?.password

            if(!hashpassword) throw new Error("Invalid Credentials")
                
                const isValid = await bcryptHelper.checkPasswordService(password, hashpassword );
                
                if (!isValid)  throw new Error("Invalid Credentials");
                if (infoUser?.dataValues?.isActive)  throw new Error("You are Ban User");


            // access token
            const token = await jwt_helper.createToken({...data, id: infoUser?.dataValues?.id,});
            
            // refresh token 
            const refreshToken = await jwt_helper.createRefreshToken({email, id: infoUser?.dataValues?.id,});

          

            // update refresh token in db 
            await USER_REPO.updateById({refreshToken: refreshToken},infoUser?.dataValues?.id );
            

            res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

            const response = {
                email: data.email,
                id: infoUser?.dataValues?.id,
                role: infoUser?.dataValues?.role,
                username: infoUser?.dataValues?.username,
                jwt: token,
                isActive: infoUser?.dataValues?.isActive
            }
            
            return response;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
             throw error;
            // throw new ServiceError()
        }
    }

    async verifyToken(data){
        try {
           
            const user = await jwt_helper.verifyToken(data);

             if (!user)
                throw new AppError(
                        'Verify Token Errors',
                        `Token is invalid or Expired`,
                        'Issue in verifying token in userService in  verifyToken function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
               
            
            const infoUser = await USER_REPO.getByEmail(user.data.email);

           
            const response = {
                email: user.data.email,
                role: infoUser?.dataValues?.role,
                username: infoUser?.dataValues?.username,
                jwt: data,
            }
            
            return response;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (verifyToken) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

      async genRefreshToken(data, res){
        try {
         
            const isvalid = await jwt_helper.verifyRefreshToken(data);
            if(!isvalid) return 'invalid refresh token '
             if (!isvalid)
                throw new AppError(
                        'Verify Token Errors',
                        `Token is invalid or Expired`,
                        'Issue in verifying token in userService in  verifyToken function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );
            
            const infoUser = await USER_REPO.getById(isvalid.data.id); 
            
            
            if(!infoUser || infoUser?.dataValues?.refreshToken !== data) return 'invalid user or refresh token '

                
            const user = infoUser?.dataValues;
             // refresh token 
            const refreshToken = await jwt_helper.createRefreshToken({email: user.email, id: user.id,});

           // access token
             
            const token = await jwt_helper.createToken({email: user.email ,id: user.id,role: user.role, username:user.username});

            // update refresh token in db 
            await USER_REPO.updateById({refreshToken: refreshToken},user.id );
            

            res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

        

            const response = {
                email: user.email,
                role: user.role,
                username: user.username,
                jwt: token,
            }
            
            return response;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (genRefreshToken) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }
    
    async getAllUserPagtion( page, limit, data){
        try {
           
            
            const offset = (page - 1) * limit;
            const response = await USER_REPO.getALLUserProPagation(offset, limit, data);

           
            
            return response;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (getAllUser) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async getAllUserWithoutFilterPagtion( ){
        try {
           
            
           
            const response = await USER_REPO.getAll();

           
            
            return response;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (getAllUser) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async userUpdateById(data, id ){
        try {
            const response = await USER_REPO.updateById(data, id);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (userUpdateById) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async bulkUpdateUserId(data ){
        try {
            const response = await USER_REPO.bulkUpdateByid(data);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (userUpdateById) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async logout(data, res){
        try {
           
            const user = await jwt_helper.verifyRefreshToken(data);
            // console.log(user.data)

             if (!user)
                throw new AppError(
                        'Verify Token Errors',
                        `Token is invalid or Expired`,
                        'Issue in verifying token in userService in  verifyToken function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );

             // update refresh token in db 
            await USER_REPO.updateById({refreshToken: null},user.data.id );
            res.clearCookie("refreshToken");
               
            
            
            return `Log out user ${user.data.id} `;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (verifyToken) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    // cart 

    async getCartById(userId){
        try {
            const  response =  cartRepo.getCartById(userId);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (getCart) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async addItem(userId, productId, quantity, price){
        try {
            
            const  response =  cartRepo.addItem(userId, productId, quantity, price);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (addItem) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


    async clearCart(userId){
        try {
            const  response =  cartRepo.clearCart(userId);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (clearCart) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }



    async removeItem(cartItemId){
        try {
            const  response =  cartRepo.removeItem(cartItemId);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (cartItemId) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async updateItem(cartItemId, quantity, selected){
        try {
            const  response =  cartRepo.updateItem(cartItemId, quantity, selected);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (updateItem) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async deleteItemBluk(cartItemIds){
        try {
            const  response =  cartRepo.removeItemBulk(cartItemIds);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (updateItem) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

      async updateItemBluk(cartItemIds){
        try {
            const  response =  cartRepo.BulkupdateItem(cartItemIds);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (updateItemBluk) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }
    
    async checkout(userId){
        try {
            const  response =  cartRepo.checkout(userId);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (checkout) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


}

const userservice= new userService()

module.exports = userservice;