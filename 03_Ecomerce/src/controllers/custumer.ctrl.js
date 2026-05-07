const { FORTEND_SUCESS_URL } = require("../config/serverConfig");
const {
  custumerService,
  cartService,
  orderService,

} = require("../services/index");
const { SucessCode, ServerErrosCodes } = require("../utlis/Errors/https.codes");
const { AppError, HttpsStatusCodes, asyncHandler, responseHandler } = require("../utlis/index");
const   s3Service = require('../services/s3.service')

class CustumerControllers {

      getProduct = asyncHandler( 
            async (req,res) => {
                const {
                  page,
                  limit,
                  title,
                  sort,
                  category,
                  minPrice,
                  maxPrice,
                  rating,
                  brand,
                } = req?.query;

                const data = {
                  category: category || null,
                  minPrice: minPrice ? parseInt(minPrice) : null,
                  maxPrice: maxPrice ? parseInt(maxPrice) : null,
                  rating: rating ? parseFloat(rating) : null,
                  brand: brand || null,
                  title: title || null,
                  sort: sort || null,
                };

                const response = await custumerService.getProduct(
                  page,
                  parseInt(limit),
                  data
                );
                // console.log("response => ", response);
                return responseHandler.success(res, response, "Successfully to get  products", SucessCode.OK)
            } 
      );

      getProductall = asyncHandler( 
           async (req,res) => {
               const response = await custumerService.getAllProduct();
               return responseHandler.success(res, response, "Successfully to get All products", SucessCode.OK)
           } 
       );
       
      getProductById = asyncHandler( 
            async (req,res) => {
                const { id } = req?.query;
                const response = await custumerService.getProductByid(parseInt(id));
                return responseHandler.success(res, response, "Successfully to get  products By id ", SucessCode.OK)
            } 
      );

      addOrders = asyncHandler( 
            async (req,res) => {
                const {
                  userId,
                  shippingAddress,
                  billingAddress,
                  paymentMethod,
                  orderItems,
                  userEmail
                } = req?.body;

                if (
                  !shippingAddress ||
                  !billingAddress ||
                  !paymentMethod ||
                  !orderItems ||
                  !userId || 
                  !userEmail
                ) {
                  throw new AppError(
                      "controller Error",
                      "OrderNo Not Required",
                      "shippingAddress billingAddress paymentMethod orderItems userId userEmail is Required",
                      HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
                    );
                }
                

                const response = await custumerService.addOrders({
                  userId,
                  shippingAddress,
                  billingAddress,
                  paymentMethod,
                  orderItems,
                  userEmail
                });
                return responseHandler.success(res, response, "Successfully Order Placed ", SucessCode.OK)
            } 
      );
      
      orderInitial = asyncHandler( 
            async (req,res) => {
                let {
                  userId,
                  userEmail,
                  gateway,
                  shippingAddress,
                  billingAddress,
                  paymentMethod,
                  orderItems,
                  idempotencyKey
                } = req?.body;
                paymentMethod = paymentMethod?.toUpperCase();
                const token = req?.headers["x-access-token"];
                if (
                  !shippingAddress ||
                  !gateway ||
                  !userEmail ||
                  !billingAddress ||
                  !paymentMethod ||
                  !orderItems ||
                  !userId ||
                  !idempotencyKey
                ) {
                  throw new AppError(
                      "controller Error",
                      "OrderNo Not Required",
                      " userId, userEmail, gateway,shippingAddress,billingAddress, paymentMethod,orderItems is  Required", 
                      HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
                    );
                }
                const response = await orderService.orderProcessIntialService({
                  userId,
                  shippingAddress,
                  billingAddress,
                  userEmail,
                  paymentMethod,
                  gateway,
                  orderItems,
                  token,
                  idempotencyKey
                });
                return responseHandler.success(res, response, "Successfully to initalize orders ", SucessCode.OK)
            } 
        );
  
      orderFinal = asyncHandler( 
            async (req,res) => {
                const { orderNO, total_amount, trans_id } = req.query;
                if (!orderNO, !total_amount, !trans_id) {
                  throw new AppError(
                    "controller Error",
                    "OrderNo Not Required",
                    "orderNO, total_amount, trans_id  Required",
                    HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
                  );
                }
                const response =   await orderService.completeOrderService({orderNO,total_amount,trans_id}); 
                res.redirect(`${FORTEND_SUCESS_URL}?orderNumber=${orderNO}&amount=${total_amount}`)
                // return responseHandler.success(res, response, "Successfully to get  products By id ", SucessCode.OK)
            } 
      );
      
      getDetailOrderByOrderno = asyncHandler( 
        async (req,res) => {
            const { OrderNo } = req.params;
            
            if (!OrderNo) {
              throw new AppError(
                "controller Error",
                "OrderNo Not Required",
                "OrderNo Not Required",
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
              );
            }
            const response =   await orderService.getOrdersByOrderno(OrderNo); 
            return responseHandler.success(res, response, "Successfully fetched all Orders By Order NO ", SucessCode.OK)
        } 
      );

      getOrdersByUserId = asyncHandler( 
        async (req,res) => {
            const { page, limit, id } = req?.query;
            // console.log("api hit ")
            if (!id) {
              throw new AppError(
                "controller Error",
                "Cannot have id from user    ",
                "Issue in gettting  ID in custumer controller",
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
              );
            }
            const response = await custumerService.getOrders(page, limit, id);
            return responseHandler.success(res, response, "Successfully fetched all Orders By UserId ", SucessCode.OK)
        } 
      );

      getOrdersByUserIdWithOutPagination = asyncHandler( 
        async (req,res) => {
            const {  userId } = req?.params;
            // console.log("api hit ", userId)
            if (!userId) {
              throw new AppError(
                "controller Error",
                "Cannot have id from user    ",
                "Issue in gettting  ID in custumer controller",
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
              );
            }
            const response = await custumerService.getOrdersByUserIdWithOutPagination( userId);
            return responseHandler.success(res, response, "Successfully fetched all Orders By getOrdersByUserIdWithOutPagination ", SucessCode.OK)
        } 
      );

      getOrderByUserandOrderNo = asyncHandler( 
        async (req,res) => {
            const {  userId } = req?.query;
            const {  OrderNo } = req?.params;
            console.log('from ctrl orderNo => ', OrderNo, " UserId => ", userId)
            if (!userId || !OrderNo) {
              throw new AppError(
                "controller Error",
                "Cannot have id from user    ",
                "Issue in gettting  ID in custumer controller",
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
              );
            }
            const response = await custumerService.getOrdersByUserAndOrderNo(userId, OrderNo);
            return responseHandler.success(res, response, "Successfully fetched all Orders By UserId ", SucessCode.OK)
        } 
      );


  // cart
    addItemCart = asyncHandler( 
      async (req,res) => {
          const { userId, productId, quantity, price } = req?.body;
          const response = await cartService.addItem(
            userId,
            productId,
            parseInt(quantity),
            price
          );
          return responseHandler.success(res, response, "Successfully addItemCart", SucessCode.OK)
      } 
    );

    clearCart = asyncHandler( 
      async (req,res) => {
          const { userId } = req?.query;
          const response = await cartService.clearCart(userId);
          return responseHandler.success(res, response, "Successfully clearCart", SucessCode.OK)
      } 
    );
 
    getCartById = asyncHandler( 
      async (req,res) => {
          const { userId } = req?.body;
          const response = await cartService.getCartById(userId);
          return responseHandler.success(res, response, "Successfully fetched getCartById", SucessCode.OK)
      } 
    );
  
    removeItemCart = asyncHandler( 
      async (req,res) => {
          const { itemId } = req?.params;
          const response = await cartService.removeItem(itemId);
          return responseHandler.success(res, response, "Successfully removeItemCart ", SucessCode.OK)
      } 
    );
    
    BulkremoveItemCart = asyncHandler( 
      async (req,res) => {
          const cartItemIds = req?.body;
          const response = await cartService.deleteItemBluk(cartItemIds.cartItemIds);
          return responseHandler.success(res, response, "Successfully BulkremoveItemCart ", SucessCode.OK)
      } 
    );
    
    updateItemsBluk = asyncHandler( 
      async (req,res) => {
          const cartItemIds = req?.body;
          const response = await cartService.updateItemBluk(cartItemIds);
          return responseHandler.success(res, response, "Successfully updateItemsBluk ", SucessCode.OK)
      } 
    );
    
    updateItemCart = asyncHandler( 
      async (req,res) => {
        const {  quantity, selected } = req?.body;
        const {itemId} = req?.params;
        const response = await cartService.updateItem(
          itemId,
          quantity,
          selected
        );
          return responseHandler.success(res, response, "Successfully updateItemCart ", SucessCode.OK)
      } 
    );


    checkoutCart = asyncHandler( 
      async (req,res) => {
        const { userId } = req?.query;
        const response = await cartService.checkout(userId);
        return responseHandler.success(res, response, "Successfully Checkout ", SucessCode.OK)
      } 
    );
    
    // s3 
    getSignedURL = asyncHandler( 
      async (req,res) => {
       
        const response = await s3Service.generateUploadURL();
        return responseHandler.success(res, response, "Successfully getSignedURL ", SucessCode.OK)
      } 
    );

    removeObjS3 = asyncHandler( 
      async (req,res) => {
          const { objId } = req?.params;
          const response = await s3Service.deleteObject(objId);
          return responseHandler.success(res, response, "Successfully removeObjS3 ", SucessCode.OK)
      } 
    );

}

const custumerControllers = new CustumerControllers();
module.exports = custumerControllers;
