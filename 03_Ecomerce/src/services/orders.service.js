const crypto = require("crypto");

const CurdService = require('./curd.service')
const  {Orders_Repo, Product_Repo} = require('../repository/index')
const {  ServiceError} = require('../utlis/index');
const { PAYMENT_BACKEND_URL, APIGATEWAY_BACKEND_URL } = require('../config/serverConfig');
const { Order, OrderItem,CartItem, Product,Cart,  sequelize } = require("../models");
const axios = require('axios');
const ordersRepo = require('../repository/orders.repo');
const { v4: uuidv4 } = require('uuid');
const { sendMessageToQueueService } = require('./queue.service');
const idempotancyKeyService  =require('./idempotancy.key.service')

class OrdersService extends CurdService {
    constructor(){
        super(Orders_Repo)
    }

    async completeOrderService(data){ 
         const transaction = await sequelize.transaction();
         try {
            // 1. Update orders table: payment => paid and orderStatus => confirmed
            const changes = {  paymentStatus: 'paid',  orderStatus:'confirmed' }
            await Orders_Repo.updateOrdersByOrderNo(changes,data.orderNO, { transaction });
    
            // 2. Get order details with transaction
            const result = await ordersRepo.getOrdersByOrderNo(data.orderNO, { transaction });
            console.log("result => ", result )
                if (!result ) {
                        throw new Error('Order not found');
                    }

            // 2.1 get user details from the auth service 
            let link = `${APIGATEWAY_BACKEND_URL}/auth/email/${result?.dataValues?.userId}`;   
            console.log("Calling auth mail => ", link)
            const user = await axios.get(link);

            // console.log("user => ", user?.data?.data)
            
            const UserDetail = user?.data?.data;
            let orderItemsDetail = []
            // console.log('userDetails => ', UserDetail);

            // 1. Get cartId for the user
            const userCart = await Cart.findOne({
                    where: { userId: UserDetail.id },
                      transaction 
                });

            for (const item of result.OrderItems) {
                const val = item.dataValues;
                
                orderItemsDetail.push({
                    'productId': val.productId,
                    'Name': val.productName,
                    'qty': val.quantity,
                    'total': val.total
                });

                // Reduce product quantity in inventory
                await Product_Repo.deincreaceQunatity(
                    val.productId, 
                    val.quantity, 
                    { transaction }
                );


                // 5.1 Remove from cart
        
                // console.log('usercart => ', userCart.id === cartId  )
                // 2. Remove the product from cartitems
                if (userCart) {
                  const cartdata =   await CartItem.update(
                        { selected: true }, 
                        {
                            where: {
                                cartId: userCart.dataValues.id,
                                productId:  val.productId 
                            },
                             transaction 
                        }
                    );
                }
            }

            await transaction.commit();
        

         
         // 2. send to remainder now for confirm orders 

            const payload = { 
                userId: UserDetail.id, 
                email: UserDetail.email,
                eventType: 'ORDER_CONFIRM',
                channel: 'EMAIL',
                referenceType: "ORDER_CONFIRM",
                payload: {
                    subject: "ORDER CONFIRM MarketMandu", 
                    content: "Reset",
                    username: UserDetail.Username || UserDetail.email,

                    orderItems:orderItemsDetail,
                    orderId: result.dataValues.orderNumber,
                    shipping_fee: result.dataValues.shippingFee,
                    tax: result.dataValues.tax,
                    deliveryEstimatedDate: result.dataValues.deliveredAt,
                    notificationTime: new Date().toISOString(),
                    transactionId:  data.trans_id,
                    amount: result.dataValues.totalAmount,
                    currency: 'NPR',
                },
                retryCount: 0,
                scheduledAt: new Date(Date.now() + 5 * 60 * 60 * 1000), 
            };
            
            await sendMessageToQueueService(payload, 'CREATE_NOTIFICATION');



        return payload;

        } catch (error) {
            await transaction.rollback();
            console.log("something went wrong in service curd level  (getById) ", error)
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async updateService(data, orderNumber ){
        try {
            const res = await Orders_Repo.updateOrdersByOrderNo(data,orderNumber);
            return res;
        } catch (error) {
            console.log("something went wrong in service curd level  (getById) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


    async getAllOrders(offset,limit){
        try {

        const res = await Orders_Repo.getAllOrders(offset,limit);
        return res;

        } catch (error) {
            console.log("something went wrong in service curd level  (getById) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

     async getOrdersByOrderno(OrderNo){
        try {
        // console.log("Order NO from getorderByOrderno = >", OrderNo)
        const res = await Orders_Repo.getOrdersByOrderNo(OrderNo);
        // console.log('order no  => ', res )
        return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (getOrdersByOrderno) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


    async getAllOrderWithoutFilterORderService(){
        try {
            const res = await Orders_Repo.getAllOrdersWithoutFilter();
            return res;
        } catch (error) {
            console.log("something went wrong in service curd level  (getById) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


    async orderProcessIntialService(data) {
        try {

            // check the idempotencykey  
            const requestHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
            let key = null;  
            const [keyRecord, created] = await idempotancyKeyService.findOrCreateService({
                    where: { key: data.idempotencyKey },
                    defaults: {
                        userId: data.userId,
                        operation: 'order initialization',
                        requestHash: requestHash,
                        responseSnapshot: {},
                        status: 'IN_PROGRESS'
                    }
            });
            if (!created) {
                if (keyRecord.requestHash !== requestHash) {
                    throw new Error("IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD");
                }
                if (keyRecord.status === "IN_PROGRESS") {
                    throw new Error("PROCESSING_THIS_REQUEST");
                }
                // Return cached SUCCESS response
                return keyRecord.responseSnapshot;
            }

            let subtotal  = 0 ; 
            const products = [];
            let i =0;
            // loop 
            for (let item of data.orderItems) {
                i++;
                // console.log(` item from data items  ${i} => ${item} `)
                const product = await Product.findByPk(item.productId, );

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
                        
                    );

                    
                }
     

            // 5. Generate summary
            const summary = {
                transactionId: order.id,
                Total_Price: totalAmount,
                userEmail: data.userEmail,
                orderId: order.orderNumber,
                orderItems: data.orderItems,
                userId,
            };

            // console.log('summary', summary);

            // 7 calling payment gateway 
            const response = await this.#paymentIntialize(data.gateway, summary, data.token);  
            await idempotancyKeyService.updateByData(
                { key: data.idempotencyKey },
                { responseSnapshot: response, status: "SUCCESS" }
            );         
            return response;

        } catch (error) {
            console.log('Something went wrong in service (booking)', error);
            throw error;
        }
    }

    async #paymentIntialize(gateway, data, token) {
        try {

            let link;
            let reqBody;

            // console.log('gateway => ', gateway, " summary => ", data)
            switch (gateway) {
                case 'esewa':
                    // console.log('data => ', data)
                    const trans_id = uuidv4(); 
                    link = `${PAYMENT_BACKEND_URL}/initialize-esewa`; 
                    reqBody = { 
                        transactionId: trans_id,
                        totalPrice: parseInt(data.Total_Price, 10),
                        userEmail: data.userEmail,
                        orderId: data.orderId 
                    };
                    break;
  
                case 'khalti':
                    link = `${PAYMENT_BACKEND_URL}/epayment/initiate/`
                    reqBody = {
                        transactionId: data.transactionId,
                        return_url: "https://www.verify.com",
                        website_url: "https://www.frontend.com",
                        amount: parseInt(data.Total_Price, 10)* 100,
                        purchase_order_id: data.orderId,
                        purchase_order_name: data.orderId,
                        customer_info: {
                            items: data.orderItems,
                            "userEmail": data.userEmail
                        }
                    };
                    break;

                case 'stripe':
                    link = `${PAYMENT_BACKEND_URL}/stripe-initiate/`
                    reqBody = {
                        transactionId: data.transactionId,
                        userEmail: data.userEmail,
                        amount: data.Total_Price,
                        items: data.orderItems,
                        orderId: data.orderId
                    }
                    break;
            }


            // console.log(' from payment url  Link => ', link, )
            const axiosResult = await axios.post(link, reqBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token ,
                }
            });

            return axiosResult.data;

        } catch (error) {
            console.log('Something went wrong in service (PaymentIntialize)', error);
            throw error;
        }
    }


}

const ordersservice= new OrdersService()

module.exports = ordersservice;