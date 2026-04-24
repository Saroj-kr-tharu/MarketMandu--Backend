const { KHALTI_PAYMENT_URL, KHALTI_SECRET_KEY, KHALTI_VERIFICATION_URL } = require('../config/khaltiConfig');
const axios = require('axios');
const { PAYMENT_BACKEND_URL, APIGATEWAY_BACKEND_URL,ECOMMERCE_BACKEND_URL } = require('../config/serverConfig');
const paymentTransactionService = require('./payment.transaction.svc');
const rabbitMqService = require('../Utlis/messageQueue');

class KhaltiService {


    async intializePaymentService(data) {
        try {

            // 1. initialize-khalti
            console.log('from khalti intialize data => ',data);

            // -> make a request call to 
            var options = {
                'method': 'POST',
                'url': KHALTI_PAYMENT_URL,
                'headers': {
                    'Authorization': `key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    "return_url": data.return_url,
                    "website_url": data.website_url,
                    "amount": data.amount ,
                    "purchase_order_id": data.transactionId ? data.transactionId.toString() : data.purchase_order_id,
                    "purchase_order_name": data.purchase_order_name,
                    "customer_info": data.custumer_info
                })
            }

            const response = await axios(options);


            const result = response?.data;
            // console.log('result => ', result);

            // -> make a record at transitionTable
            let finalData = { amount: parseInt(data.amount)/100, userEmail: data.customer_info.userEmail,status:'PENDING', transactionId: result.pidx, paymentMethod: "KHALTI", orderId: data.orderId };
            // console.log('final data => ', finalData);
            await paymentTransactionService.createService(finalData);

            // // -> return the response pxid,paymentUrl
            return result;




        } catch (error) {
            console.log("Something went wrong in service layer (intializePaymentService)");
            console.log("error => ", error);
            throw error;
        }
    }


    async #verifyKhaltiPayment(data) {
        try {

            console.log('verify khalti data => ',data );
            // Verify payment with khalti
            var options = {
                'url': KHALTI_VERIFICATION_URL,
                'method': 'POST',
                'headers': {
                    'Authorization': `key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },

                data: JSON.stringify({ 'pidx': data })
            }

            const response = await axios(options);
            // console.log(response.data);
            return response?.data;


        } catch (error) {
            console.log("Something went wrong in service layer (verifyKhaltiService)");
            // console.log('error => ', error?.response);
            throw error;
        }
    }



    async completePaymentService(data) {
        try {

            // Verify payment with khalti
            const response = await this.#verifyKhaltiPayment(data.pidx);
            console.log('response from verify data => ', response)

            // check the status 
            if (response.status != 'Completed') {
                await paymentTransactionService.updateByTransId(response.pidx, { status: 'FAILED' });
                // send queue to send msg to remainder service 
                // -> transition id , amount , date , gateway , email_status
                return 'Payment Failed '
            }

            // update  payment record in the database from pending to complete
            await paymentTransactionService.updateByTransId(response.pidx, { status: 'SUCCESS' });


            // send queue to send msg to remainder service 
            // -> transition id , amount , date , gateway , email_status

            const getdata = await paymentTransactionService.getDetailsByTransid(response.pidx);

            // console.log('data from db => ', getdata)

            const payload = {
                subject: "Payment Notification System",
                email: getdata.userEmail,
                notificationTime: new Date(),
                gateway: 'KHALTI',
                transactionId:getdata.transactionId,
                amount: getdata.amount,
                currency: 'npr', 
                status: 'COMPLETE'
            };

             await rabbitMqService.sendMessageToQueueService(payload);
            // Respond with success messagev
              console.log('trans => from completed payment ', getdata.dataValues.orderId)
              const orderId = encodeURIComponent(getdata?.dataValues?.orderId ?? '');
              const totalAmount = Number.parseInt(response?.total_amount ?? 0) / 100;
              const link = `${ECOMMERCE_BACKEND_URL}/orders/orderFinal?orderNO=${orderId}&total_amount=${totalAmount}&trans_id=${getdata.transactionId}`;
 
            //    console.log(' link =>  ', link) 
            return link;



        } catch (error) {
            console.log("Something went wrong in service layer (completePaymentService)");
            throw error;
        }
    }


}



const khaltiService = new KhaltiService();

module.exports = khaltiService;