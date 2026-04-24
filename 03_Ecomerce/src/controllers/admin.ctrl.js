
const {SucessCode,ServerErrosCodes} = require('../utlis/Errors/https.codes')
const {adminService, orderService, userService} = require('../services/index');
const { asyncHandler, responseHandler } = require('../utlis');

class AdminController { 


    addProduct = asyncHandler( 
        async (req,res) => {
            const data = req?.body;
            const response = await adminService.createService(data);
            return responseHandler.success(res, response, "Successfully to add products", SucessCode.CREATED)
        } 
    );

    editProduct = asyncHandler( 
        async (req,res) => {
            const data = req?.body;
            const id = req?.query?.id;
            const response = await adminService.updateService(data, id);
            return responseHandler.success(res, response, "Successfully to update Products", SucessCode.OK)
        } 
    );
    
    
    deleteProduct = asyncHandler( 
        async (req,res) => {
            const id = req?.query?.id;
            const response = await adminService.deleteByIdService(id);
            return responseHandler.success(res, response, "Successfully delete product", SucessCode.OK)
        } 
    );
    
    bulkdeleteProduct = asyncHandler( 
        async (req,res) => {
            const {data} = req?.body;
            const response = await adminService.deleteBulkService(data);
            return responseHandler.success(res, response, "Successfully bulk delete Product", SucessCode.OK)
        } 
    );
    

    getAllOrders = asyncHandler( 
        async (req,res) => {
            const {page,limit} = req?.query;
            const response = await adminService.getAllOrders(page,parseInt(limit));
            return responseHandler.success(res, response, "Successfully fetched all orders", SucessCode.OK)
        } 
    );

    getAllOrdersWithoutFilter = asyncHandler( 
        async (req,res) => {
            const response = await adminService.getAllOrdersWithoutFilter();
            return responseHandler.success(res, response, "Successfully fetched all orders", SucessCode.OK)
        } 
    );

    editOrders = asyncHandler( 
        async (req,res) => {
            const {orderId} = req?.query;
            const data = req?.body; 
            const response = await orderService.updateService(data, orderId);
            return responseHandler.success(res, response, "Successfully updated orders", SucessCode.OK)
        } 
    );

    

   

}



const adminController = new AdminController();
module.exports = adminController;