const CurdService = require('./curd.service')
const  USER_REPO = require('../repository/user.repo')


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
    
    async upsertData(data) {
        try { 
            console.log("upsert service data => ", data )  
            // let data = { id: userId, email, username } 
            const res = await USER_REPO.upsertDB({id: data.userId, email: data.email, username: data.username, role:data?.role });
            return res;
        } catch (error) {
            console.log("Something went wrong in service layer (getByData)");
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

   

   
}

const userservice= new userService()
module.exports = userservice;