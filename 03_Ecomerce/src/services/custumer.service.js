const CurdService = require('./curd.service')
const  {Product_Repo, Orders_Repo} = require('../repository/index')
const { Order, OrderItem,CartItem, Product,Cart,  sequelize } = require("../models");
const {  ServiceError, AppError, HttpsStatusCodes} = require('../utlis/index');
const cart = require('../models/cart');
const axios = require('axios');
const { PAYMENT_BACKEND_URL } = require('../config/serverConfig');
const { v4: uuidv4 } = require('uuid');

class custumerService extends CurdService {
    constructor(){
        super(Product_Repo)
    }

    async getProduct(page=1, limit=5, data){
        try {
            
            const offset = (page - 1) * parseInt(limit);
            const res = await Product_Repo.getProPagation(offset,limit, data);
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (getProduct) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }
 
    async getAllProduct(){
        try {
            
            const res = await Product_Repo.getAll();
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (getProduct) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async getProductByid(id){
        try {
            console.log('id => ', id)
            const res = await Product_Repo.getProductByIdRepo(id);
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (getProductByid) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async addOrders( data){
        try { 

            // start transaction 
            const t = await sequelize.transaction();

            let subtotal  = 0 ; 
            const products = [];
            let orderItemsDetail= [];

            // loop 
            for (let item of data.orderItems) {
                const product = await Product.findByPk(item.productId, { transaction: t });

                // check product exist
                if (!product) 
                    throw new AppError(
                        'add Orders Errors',
                        `Product with ID ${item.productId} not found`,
                        'Issue in getting product in custumerService in  addOrders function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

                    );

                // check the qunatity is 0
                if (item.quantity == 0 ) 
                    throw new AppError(
                        'check Quantity Errors',
                        `Product  name ${product.name} fortend put 0 quantity`,
                        'Issue in qunatity in custumerService in  addOrders function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
                    );


                // check stock 
                if (product.stock < item.quantity)
                    throw new AppError(
                        'add Orders Errors',
                        `Not enough stock for product ${product.name}`,
                        'Issue in stock of  product in custumerService in  addOrders function ',
                        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR
                    );

                orderItemsDetail.push({
                    'productId': item.productId,
                    'Name': product.name,
                    'qty': item.quantity,
                    'total': product.price * item.quantity
                });

                // add to product
                products.push(product);

                // Calculate subtotal using DB price
                subtotal += product.price * item.quantity;
            }



            // 2️ Calculate tax, shipping, total
            const tax = subtotal * 0.13; // example: 13% tax
            const shippingFee = 50;  // fixed now 
            const discount = 0; // no discount 
            const totalAmount = parseFloat((subtotal + tax + shippingFee - discount).toFixed(3));

            const {userId,paymentMethod,shippingAddress, billingAddress  } = data; 
            
            // calculate deliveredDate
            const deliveredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
            

             // 3️ Create order
                const order = await Order.create(
                    {
                        userId,
                        orderNumber: "ORD" + Date.now(),
                        subtotal,
                        tax,
                        shippingFee,
                        discount,
                        totalAmount,
                        paymentMethod,
                        paymentStatus: "pending",
                        orderStatus: "pending",
                        shippingAddress,
                        billingAddress,
                        isActive: 1,
                        deliveredAt , 
                        cancelledAt:null ,
                    },
                    { transaction: t }
                );

                // 4️ Create order items & update stock
                for (let i = 0; i < data.orderItems.length; i++) { 
                    const item = data.orderItems[i];
                    const product = products[i]; 
                    
                    // Create order item
                    await OrderItem.create(
                        {
                        orderId: order.id,
                        productId: product.id,
                        productName: product.name,
                        productPrice: product.price, 
                        quantity: item.quantity,
                        total: product.price * item.quantity,
                        },
                        { transaction: t }
                    );

                    // Reduce product stock
                    product.stock -= item.quantity;
                    await product.save({ transaction: t });


                    // 5.1 Remove from cart
                    // 1. Get cartId for the user
                    const userCart = await Cart.findOne({
                        where: { userId: userId },
                        transaction: t
                    });
                    // console.log('usercart => ', userCart.id === cartId  )
                    // 2. Remove the product from cartitems
                    if (userCart) {
                        // console.log('product =>  ',product.id)
                        // console.log('product =>  ',userCart.dataValues.id)
                      const user =   await CartItem.update(
                            { selected: true }, 
                            {
                                where: {
                                    cartId: userCart.dataValues.id,
                                    productId: product.id
                                },
                                transaction: t
                            }
                        );
                        // console.log('user => ', user )
                    }

                    
                }
                
                

                // 5️ Commit transaction
                await t.commit();

                // goto payment db 
                 const trans_id = uuidv4(); 
                 let  reqBody = {
                        transactionId: trans_id,
                        userEmail: data.userEmail,
                        amount: totalAmount,
                        items: orderItemsDetail,
                        orderId: order.orderNumber,
                        tax, 
                        shippingFee,
                        deliveredAt,
                        Subtotal: subtotal
                    }

                 
                let link = `${PAYMENT_BACKEND_URL}/cod-initiate`;
                 const axiosResult = await axios.post(link, reqBody, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                 

            // 6️ Return 
             const res =  {
                orderId: order.id,
                orderNumber: order.orderNumber,
                totalAmount,
            }

            console.log('axiosn => ', axiosResult.data)
             return axiosResult.data;

            // return res;

             

        } catch (error) {
            console.log("something went wrong in service curd level  (add) ")
           if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw error
        }
    }


     async getOrders(page, limit , id){
        try {
            const offset = (page - 1) * limit;
            const res = await Orders_Repo.getByUserId(offset, limit, id);
            
            return res; 

        } catch (error) {
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }



}

const custumerservice= new custumerService()

module.exports = custumerservice;