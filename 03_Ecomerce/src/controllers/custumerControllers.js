const { FORTEND_SUCESS_URL } = require("../config/serverConfig");
const {
  custumerService,
  userService,
  orderService,
} = require("../services/index");
const { SucessCode, ServerErrosCodes } = require("../utlis/Errors/https_codes");
const { AppError, HttpsStatusCodes } = require("../utlis/index");

class CustumerControllers {
  async getProduct(req, res) {
    try {
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

      return res.status(SucessCode.OK).json({
        message: "Successfully to add products",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("something went wrong in controller  level  (add) ");
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async getProductall(req, res) {
    try {
      const response = await custumerService.getAllProduct();

      return res.status(SucessCode.OK).json({
        message: "Successfully to add products",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("something went wrong in controller  level  (add) ");
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req?.query;

      const response = await custumerService.getProductByid(parseInt(id));

      return res.status(SucessCode.OK).json({
        message: "Successfully to get  products By id ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (getProductById) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async addOrders(req, res) {
    try {
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
        throw new Error(" required is not mention  ");
      }

      const response = await custumerService.addOrders({
        userId,
        shippingAddress,
        billingAddress,
        paymentMethod,
        orderItems,
        userEmail
      });

      return res.status(SucessCode.OK).json({
        message: "Successfully to add products",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (addordres) ",
        error
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  // order intial
  async orderInitial(req, res) {
    try {
      const {
        userId,
        userEmail,
        gateway,
        shippingAddress,
        billingAddress,
        paymentMethod,
        orderItems,
      } = req?.body;


      console.log(' data ',  userId,
        shippingAddress,
        billingAddress,
        userEmail,
        paymentMethod,
        gateway,
        orderItems,)

      if (
        !shippingAddress ||
        !gateway ||
        !userEmail ||
        !billingAddress ||
        !paymentMethod ||
        !orderItems ||
        !userId
      ) {
        throw new Error("  required is not mention from order Intial   ");
      }


      

      const response = await orderService.orderProcessIntialService({
        userId,
        shippingAddress,
        billingAddress,
        userEmail,
        paymentMethod,
        gateway,
        orderItems,
      });

      console.log('response from controller => ', response)

      // res.redirect(response.data.payment_url)

      return res.status(SucessCode.OK).json({
        message: "Successfully to initalize orders ",
        success: true,
        data: response,
        err: {},
      });


    } catch (error) {
      console.log(
        "something went wrong in controller  level  (addordres) ",
        error
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  // order final
  async orderFinal(req, res) { 
    try {
      const { orderNO, total_amount, trans_id } = req.query;

      if ( !orderNO, !total_amount, !trans_id ) {  throw new Error(" required is not mention  "); }

      

    //   console.log('order final => ', data , orderNO)
        const response =   await orderService.completeOrderService({orderNO,total_amount,trans_id}); 
        console.log('response => ', response)
        // http://localhost:4200/ordersuccess?orderNumber=ORD1765432072209&amount=2083.989
        res.redirect(`${FORTEND_SUCESS_URL}?orderNumber=${orderNO}&amount=${total_amount}`)

    
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (orderFinal) ",
        error
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async getDetailOrderByOrderno(req, res) { 
    try {
      const { orderNO } = req.query;

      if ( !orderNO ) {  throw new Error(" required is not mention  "); }

      

    //   console.log('order final => ', data , orderNO)
        const response =   await orderService.getOrdersByOrderno(orderNO); 
        // console.log('response => ', response)

        console.log('response => ', response[0].dataValues)
        console.log('users => ', response[0].dataValues.user.dataValues)
        // console.log('orderItems => ', response[0].OrderItems[0].dataValues)
       response[0].OrderItems.forEach((item, index) => {
        const val = item.dataValues;
        console.log(
          `${index} => productId: ${val.productId}, Name: ${val.productName}  , qty: ${val.quantity}, total: ${val.total}`
        );
      });

         return res.status(SucessCode.OK).json({
            message: "Successfully fetched all Orders ",
            success: true,
            data: response,
            err: {},
          });

    
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (orderFinal) ",
        error
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async getOrdersByUserId(req, res) {
    try {
      const { page, limit, id } = req?.query;

      if (!id) {
        throw new AppError(
          "controller Error",
          "Cannot have id from user    ",
          "Issue in gettting  ID in custumer controller",
          HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
        );
      }

      const response = await custumerService.getOrders(page, limit, id);

      return res.status(SucessCode.OK).json({
        message: "Successfully fetched all Orders ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (getOrdersByUserId) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  // cart
  async addItemCart(req, res) {
    try {
      const { userId, productId, quantity, price } = req?.body;

      const response = await userService.addItem(
        userId,
        productId,
        parseInt(quantity),
        price
      );

      return res.status(SucessCode.OK).json({
        message: "Successfully addItemCart  ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (getOrdersByUserId) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async clearCart(req, res) {
    try {
      const { userId } = req?.query;

      const response = await userService.clearCart(userId);

      return res.status(SucessCode.OK).json({
        message: "Successfully clearCart ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (getOrdersByUserId) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async getCartById(req, res) {
    try {
      const { userId } = req?.body;
      console.log("user id => ", userId);

      const response = await userService.getCartById(userId);

      return res.status(SucessCode.OK).json({
        message: "Successfully fetched getCartById ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("something went wrong in controller  level  (getCartById) ");
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async removeItemCart(req, res) {
    try {
      const { cartItemId } = req?.query;

      const response = await userService.removeItem(cartItemId);

      return res.status(SucessCode.OK).json({
        message: "Successfully removeItemCart ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (removeItemCart) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async BulkremoveItemCart(req, res) {
    try {
      const cartItemIds = req?.body;

      console.log("cart id => ", cartItemIds);

      const response = await userService.deleteItemBluk(cartItemIds);

      return res.status(SucessCode.OK).json({
        message: "Successfully removeItemCart ",
        success: true,
        data: { response, cartItemIds },
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (removeItemCart) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async updateItemsBluk(req, res) {
    try {
      const cartItemIds = req?.body;

      console.log("Bulk upate => ", cartItemIds);

      const response = await userService.updateItemBluk(cartItemIds);

      return res.status(SucessCode.OK).json({
        message: "Successfully updateItemsBluk ",
        success: true,
        data: { response, cartItemIds },
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (updateItemsBluk) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async updateItemCart(req, res) {
    try {
      const { cartItemId, quantity, selected } = req?.body;

      const response = await userService.updateItem(
        cartItemId,
        quantity,
        selected
      );

      return res.status(SucessCode.OK).json({
        message: "Successfully updateItemCart ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log(
        "something went wrong in controller  level  (updateItemCart) "
      );
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }

  async checkoutCart(req, res) {
    try {
      const { userId } = req?.query;

      console.log("user id => ", userId);
      const response = await userService.checkout(userId);

      return res.status(SucessCode.OK).json({
        message: "Successfully Checkout Getting  ",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("something went wrong in controller  level  (checkoutCart) ");
      return res
        .status(error.statusCode | ServerErrosCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message,
          sucess: false,
          data: {},
          err: error.explanation,
        });
    }
  }
}

const custumerControllers = new CustumerControllers();

module.exports = custumerControllers;
