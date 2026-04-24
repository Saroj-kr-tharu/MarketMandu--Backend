const axios = require('axios');
const { ESEWA_PRODUCT_CODE, ESEWA_SECRET_KEY, ESEWA_GATEWAY_URL, APIGATEWAY_BACKEND_URL } = require('../config/esewaConfig');
const crypto = require('crypto');
const paymentTransactionService = require('./payment.transaction.svc');
const rabbitMqService = require('../Utlis/messageQueue');
const {  PAYMENT_BACKEND_URL,ECOMMERCE_BACKEND_URL } = require('../config/serverConfig');

class EsewaService {


    async #getEsewaPaymentHash({ amount, transaction_uuid }) {
        try {
            const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_PRODUCT_CODE}`;

            // console.log('data received => ', data);

            const hash = crypto
                .createHmac("sha256", ESEWA_SECRET_KEY)
                .update(data)
                .digest("base64");

            // console.log('signature generated => ', hash);

            return {
                signature: hash,
                signed_field_names: "total_amount,transaction_uuid,product_code",
            };
        } catch (error) {
            console.log('error => ', error)
            throw error;
        }
    }


    async  #verifyEsewaPayment(encodedData) {
        try {

            // decoding base64 code revieved from esewa
            let decodedData = atob(encodedData);
            decodedData = await JSON.parse(decodedData);
            let headersList = {
                Accept: "application/json",
                "Content-Type": "application/json",
            };

            const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

            const secretKey = ESEWA_SECRET_KEY;
            const hash = crypto
                .createHmac("sha256", secretKey)
                .update(data)
                .digest("base64");

            console.log(hash);
            console.log(decodedData.signature);
            let reqOptions = {
                url: `${ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
                method: "GET",
                headers: headersList,
            };
            if (hash !== decodedData.signature) {
                throw { message: "Invalid Info", decodedData };
            }
            let response = await axios.request(reqOptions);


            if (
                response.data.status !== "COMPLETE" ||
                response.data.transaction_uuid !== decodedData.transaction_uuid ||
                Number(response.data.total_amount) !== Number(decodedData.total_amount)
            ) {
                throw { message: "Invalid Info", decodedData };
            }
            return { response: response.data, decodedData };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async intializePaymentService(data) { 
        try {

            console.log('origin data => ', data)
            // 1. initialize-esewa 

            // -> generate a unique paymentId
            // const transactionId = await esewaHelperUtlis.genRandString();
            const transactionId = data.transactionId;

            // -> create Record at transitionTable 
            // let finalData = { ...data, status: 'pending', transactionId, paymentMethod: "eSewa" };
             let finalData = { amount: parseInt(data.amount), userEmail: data.userEmail,status:'PENDING', transactionId: transactionId, paymentMethod: "ESEWA", orderId: data.orderId };
           
            // console.log('final data => ', finalData);
 
            await paymentTransactionService.createService(finalData);

            // -> generate hash 
            const hash = await this.#getEsewaPaymentHash({ amount: data.amount, transaction_uuid: transactionId });
            //   console.log( '  hash => ', hash, ' and trans => ', transactionId);

            // -> return hash and transition id 
            return {
                hash,
                transactionId 
            }


        } catch (error) {
            console.log("Something went wrong in service layer (intializePaymentService)");
            throw error;
        }
    }

    async completePaymentService(data) {
        try {
            // Verify payment with eSewa
            const result = await this.#verifyEsewaPayment(data);
            // console.log('result => ', result.response);
            const transactionId = result.response.transaction_uuid;


            // update  payment record in the database from pending to complete
            await paymentTransactionService.updateByTransId(transactionId, { status: 'SUCCESS' });


            // send queue to send msg to remainder service 
            // -> transition id , amount , date , gateway , 
            const getdata = await paymentTransactionService.getDetailsByTransid(transactionId);
            // console.log('get data from esewa => ', getdata)

            const payload = {
                subject: "Payment Notification System",
                email: getdata.dataValues.userEmail,
                notificationTime: new Date(),
                gateway: 'ESEWA',  
                transactionId,
                amount: getdata.dataValues.amount,
                currency: 'npr',
                status: 'COMPLETE' 
            };
            
            await rabbitMqService.sendMessageToQueueService(payload);
            const orderId = encodeURIComponent(getdata?.dataValues?.orderId ?? '');
            const totalAmount = Number.parseInt(getdata.dataValues.amount ?? 0);
            const link = `${ECOMMERCE_BACKEND_URL}/orders/orderFinal?orderNO=${orderId}&total_amount=${totalAmount}&trans_id=${transactionId}`;  
 
            // const link = `${MOVIE_BOOKING_URL}/FinalComplete?transId=${encodeURIComponent(transactionId)}`
            return link;
 
        } catch (error) {
            console.log("Something went wrong in service layer (completePaymentService)");
            throw error;
        }
    }


}



const esewaService = new EsewaService();

module.exports = esewaService;