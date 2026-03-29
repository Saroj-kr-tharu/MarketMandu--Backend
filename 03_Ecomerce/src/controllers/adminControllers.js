
const {SucessCode,ServerErrosCodes} = require('../utlis/Errors/https_codes')
const {adminService, orderService, userService} = require('../services/index')

class AdminController { 

    async addProduct(req,res) {
        try {
            
    
            const data = req?.body;
            console.log('data => ', data)
            const response = await adminService.createService(data);
            
            return res.status(SucessCode.CREATED).json({
                message: "Successfully to add products",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (add) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR ).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }
    
    async editProduct(req,res) {
        try {
            
            const data = req?.body;
            const id = req?.query?.id;
            const response = await adminService.updateService(data, id);
            
            return res.status(SucessCode.CREATED).json({
                message: "Successfully to update Products",
                success: true,
                data: response, 
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (edit products) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR ).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

     async deleteProduct(req,res) {
        try {
            
            
            const id = req?.query?.id;
            const response = await adminService.deleteByIdService(id);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully delete product",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (delete product) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR ).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

     async bulkdeleteProduct(req,res) {
        try {
            
            console.log(req?.body)
            const {data} = req?.body;
            console.log('data => ', data)
            
            const response = await adminService.deleteByIdService(data);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully delete bulkdeleteProduct",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (bulkdeleteProduct) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR ).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }


    async getAllOrders(req,res) {
        try {
            const {page,limit} = req?.query;
            const response = await adminService.getAllOrders(page,parseInt(limit));
            
            return res.status(SucessCode.OK).json({
                message: "Successfully fetched all orders",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (getallOrders) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

     async getAllOrdersWithoutFilter(req,res) {
        try {
           
            const response = await adminService.getAllOrdersWithoutFilter();
            
            return res.status(SucessCode.OK).json({
                message: "Successfully fetched all orders",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (getAllOrdersWithoutFilter) ", error)
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }


    async editOrders(req,res) {
        try {
            const {orderId} = req?.query;
            const data = req?.body; 

            console.log(` orderId => ${orderId} and data => ${data} `)

            const response = await orderService.updateService(data, orderId);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully updated orders",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  (update orders) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

      async getAllUserWithoutFilter(req,res) {
        try {
            
           
            
            const response = await userService.getAllUserWithoutFilterPagtion();
            
            return res.status(SucessCode.OK).json({
                message: "Successfully fetched all users",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  ( getAllUsers) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }


    async updateUserById(req,res) {
        try {
            
            const {id} = req?.query;
            
            const data =req.body;
            
            const response = await userService.userUpdateById(data, id);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully fetched all users",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  ( updateUserById) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

    async BulkupdateUsers(req,res) {
        try {
            
            
            
            const {ids} =req.body;

            console.log('ids => ', ids)
            
            const response = await userService.bulkUpdateUserId(ids);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully fetched all users",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  ( updateUserById) ", error)
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

     async getAllUsers(req,res) {
        try {
            
            const {page,limit,email,role,username} = req?.query;
            
            const data = {
                email: email || null,
                role: role || null,
                username: username || null,
            };
            
            const response = await userService.getAllUserPagtion(parseInt(page),parseInt(limit),data);
            
            return res.status(SucessCode.OK).json({
                message: "Successfully fetched all users",
                success: true,
                data: response,
                err: {},
            });

        } catch (error) {
            console.log("something went wrong in controller  level  ( getAllUsers) ")
            return res.status(error.statusCode  | ServerErrosCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                sucess: false,
                data: {},
                err: error.explanation,
            });
        }
    }

}



const adminController = new AdminController();

module.exports = adminController;