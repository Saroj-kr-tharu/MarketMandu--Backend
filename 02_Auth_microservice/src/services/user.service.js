const CurdService = require('./curdService')
const  USER_REPO = require('../repository/user.repo')
const {BcryptHelper, JwtHelper,} = require('../utlis/index');


class userService extends CurdService {
    constructor(){
        super(USER_REPO)
    }

     async getByData(userId) {
        try {
            
        const res = await USER_REPO.getBydata({id:  userId});
        return res;
        } catch (error) {
        console.log("Something went wrong in service layer (getByData)");
        throw error;
        }
    }
    
    async loginService(data, res){
        try {
            const {password, email} = data;
            const infoUser = await USER_REPO.getByEmail(email);
            // console.log("user => ",infoUser?.dataValues )
            const hashpassword = infoUser?.dataValues?.password

            if(!hashpassword) throw new Error("Invalid Credentials")
                
                const isValid = await BcryptHelper.checkPasswordService(password, hashpassword );
                
                if (!isValid)  throw new Error("Invalid Credentials");
                // console.log("user => ",infoUser?.dataValues )
                if (infoUser?.dataValues?.isActive)  throw new Error("You are Ban User");

            // access token
            const token = await JwtHelper.createToken({...data, id: infoUser?.dataValues?.id,role: infoUser?.dataValues?.role});
            
            // refresh token 
            const refreshToken = await JwtHelper.createRefreshToken({email, id: infoUser?.dataValues?.id,});

          

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
            console.log("something went wrong in service curd level  (create) ", error )
             throw error;
           
        }
    }

    async verifyToken(data){
        try {
           
            const user = await JwtHelper.verifyToken(data);

             if (!user)
                throw new Error("Token is invalid or Expired");
                
               
            
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
            throw error;
        }
    }

    async genRefreshToken(data, res){
        try {
         
            const isvalid = await JwtHelper.verifyRefreshToken(data);
            if(!isvalid) throw new Error ('invalid refresh token ')
            if (!isvalid) throw new Error("Token is invalid or Expired");
            
            const infoUser = await USER_REPO.getById(isvalid.data.id); 
            
            if(!infoUser || infoUser?.dataValues?.refreshToken !== data) 
                    throw new Error("invalid user or refresh token");
                
            const user = infoUser?.dataValues;
             // refresh token 
            const refreshToken = await JwtHelper.createRefreshToken({email: user.email, id: user.id,});

           // access token
            const token = await JwtHelper.createToken({email: user.email ,id: user.id,role: user.role, username:user.username});

            // update refresh token in db 
            await USER_REPO.updateById({refreshToken: refreshToken},user.id );
            

            res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

        
            // console.log('user info from genrefreshtoken => ', user)
            const response = {
                email: user.email,
                role: user.role,
                username: user.username,
                jwt: token,
                id: user.id,
                isActive: user.isActive
            }
            
            return response;
            

        } catch (error) {
               throw error;

        }
    }
    
    async getAllUserPagtion( page, limit, data){
        try {

            const offset = (page - 1) * limit;
            const response = await USER_REPO.getALLUserProPagation(offset, limit, data);

            return response;
            

        } catch (error) {
            throw error;
          
        }
    }

    async getAllUserWithoutFilterPagtion( ){
        try {
           
            const response = await USER_REPO.getAll();
            return response;
            

        } catch (error) {
            throw error;
        }
    }

    async userUpdateById(data, id ){
        try {
            const response = await USER_REPO.updateById(data, id);
            return response;
        } catch (error) {

            console.log("something went wrong in service curd level  (userUpdateById) ")
            throw error;
    
        }
    }

    async bulkUpdateUserId(data ){
        try {
            const response = await USER_REPO.bulkUpdateByid(data);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (userUpdateById) ")
            throw error;
        }
    }

    async logout(data, res){
        try {
           
            const user = await JwtHelper.verifyRefreshToken(data);
            if (!user)
                throw new Error("Token is invalid or Expired")

             // update refresh token in db 
            await USER_REPO.updateById({refreshToken: null},user.data.id );
            res.clearCookie("refreshToken");
               
            return `Log out user ${user.data.id} `;
            

        } catch (error) {
            console.log("something went wrong in service curd level  (verifyToken) ")
            throw error;
        }
    }

   
}

const userservice= new userService()

module.exports = userservice;