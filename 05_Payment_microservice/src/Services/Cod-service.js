
const axios = require('axios');
const { MARKETMANDU_URL, FORTEND_SUCESS_URL } = require('../config/serverConfig');
const paymentTransactionService = require('./PaymentTransactionService');
const rabbitMqService = require('../Utlis/messageQueue');
const sendMessageToQueueService = require('./queueService');

class CodService {


    async intializePaymentService(data) {
        try {

            // 1. initialize-khalti
            console.log('from cod  intialize data => ',data);

           

            // -> make a record at transitionTable orderItems
            let finalData = { amount: parseInt(data.amount), userEmail: data.userEmail,status:'PENDING', transactionId: data.transactionId, orderItems:data.items, paymentMethod: "COD", orderId: data.orderId };
          
            await paymentTransactionService.createService(finalData);

      

              const payload = {
                customerName: data.userEmail,
                email: data.userEmail,
                email_status: 'SUCCESS', 
                orderItems:data.items , 
                orderId: data.orderId, 
                shipping_fee: data.shippingFee,
                tax: data.tax,

                deliveryEstimatedDate: data.deliveredAt,

                notificationTime: new Date().toISOString(),

                transactionId:  data.transactionId,
                Subtotal: data.Subtotal, 
                amount: data.amount,
                currency: 'NPR',

               
            };


          
            await sendMessageToQueueService(payload, 'CREATE_TICKET_CONFIRM');

            const link =  `${FORTEND_SUCESS_URL}?orderNumber=${data.orderId}&amount=${data.amount}`

            return link;




        } catch (error) {
            console.log("Something went wrong in service layer (intializePaymentService)");
            console.log("error => ", error);
            throw error;
        }
    }


   




}



const codService = new CodService();

module.exports = codService;