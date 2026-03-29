const CurdService = require('./curdService')
const  {Product_Repo} = require('../repository/index')
const  ordersService = require('./ordersService')
const {  ServiceError} = require('../utlis/index')

class adminService extends CurdService {
    constructor(){
        super(Product_Repo)
    }

    async deleteByIdService(data){
        try {
            // console.log('id => ', data)
            const res = Product_Repo.deleteById(data);
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

     async deleteBulkService(data){
        try {
            // console.log('id => ', data)
            const res = Product_Repo.deleteBulk(data);
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (deleteBulkService) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async getAllOrders(page, limit ){
        try {
            const offset = (page - 1) * limit;
            const res = ordersService.getAllOrders(offset, limit);
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ")
           if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async getAllOrdersWithoutFilter( ){
        try {
           
            const res = ordersService.getAllOrderWithoutFilterORderService();
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (getAllOrdersWithoutFilter) ")
           if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


   

}

const adminservice= new adminService()

module.exports = adminservice;