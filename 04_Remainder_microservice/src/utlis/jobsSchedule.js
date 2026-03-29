const cron = require("node-cron");

const { Sender, } = require("../config/email.config");
const { EMAIL_SENDER,  } = require('../config/server.config');
const redisClient = require('../config/redis.config');

const notificationService = require("../Services/notification.service")
const notificationTemplateService = require("../Services/notification.template.service")

const {
  emailTemplate
} = require("./Template/index");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setUptask = () => {

  cron.schedule("*/1 * * * * ", async () => {
    // every one minute

    try {
      console.log('Getting the pending data ');
      const mail = await notificationService.PendingMail();
      if (!mail || mail.length === 0) return;
      for (const email of mail) {
        let emailInfo = email?.dataValues; 
     
        let mailRender = null; 
          const cacheKey = `notification_template:${emailInfo.eventType}`;
          let res = null ;
          const cache = await redisClient.get(cacheKey); 
          
          if (cache) {
            // console.log('from cache => ', cache)  
            res = JSON.parse(cache);
          }
          else {
              res  = await notificationTemplateService.getBydata({eventType: emailInfo.eventType});
              res  = res?.dataValues; 
              await redisClient.set(
                  cacheKey,
                  JSON.stringify(res), 
                  {'EX':86400}
              )
          }
          
           mailRender = emailTemplate({
            ...emailInfo.payload,
              username: emailInfo.email,
              body:  res?.body,
              app_url: 'https://power11.com/login'
            });
        
        let mailoption = {
          from: EMAIL_SENDER,
          to: emailInfo?.email,
          subject: res?.subject,
          html: mailRender,
        };

        console.log(`Sending mail to ${email?.dataValues?.email}  ... `, );
        Sender.sendMail(mailoption, async (error, data) => {
          if (error) {
            console.error("Failed To Send Email to: ", mailoption.to);
          } else {
            console.log("Email Successfully Sent to : ", data.envelope.to);
            await notificationService.updateByData({ id: emailInfo.id }, { status: "SENT" });
           
          }

        });

        // Delay between sending emails to avoid rate limiting
        await delay(1000); // 1 second delay
        // await deleteService(email.id)
      }


      
    } catch (error) {
      console.log("Something Went wrong in job schedule");
      throw error;
    }
  });




  // cron.schedule("*/2 * * * * ", async () => {
  //   // every two minute

  //   try {
  //     console.log( " ... Deleteing the Sucess data at 2 minute   ...... ")
  //     await deleteDataByStatusRepo('SUCCESS');
  //     await deleteDataByStatusRepoPayment('SUCCESS');
  //     await deleteDataByStatusRepoTicket('SUCCESS');

  //   } catch (error) {
  //     console.log("Something Went wrong in job schedule", error);
  //     throw error;
  //   }
  // });


  // // payment notification 
  // cron.schedule("*/1 * * * * ", async () => {
  //   // every two minute

  //   try {
  //     console.log("geting unsent PaymentTransaction  at every 1 min   ...... ")
  //     // 1. get unsent data from the paymentTransactoin
  //     const alldata = await getPendingMailServicePayment();
  //     // console.log('all DAta => ',alldata);
  //     alldata.map(({ dataValues }) => {
  //       const {
  //         transitionId,
  //         amount,
  //         gateway,
  //         userEmail,
  //         notificationTime,
  //         id,
  //         payment_status,
  //         currency
  //       } = dataValues;


  //       const samplePaymentData = {
  //         userEmail,
  //         notificationTime,
  //         transitionId,
  //         amount,
  //         gateway,
  //         payment_status,
  //         currency
  //       };
  //       console.log(' data => ', samplePaymentData);

  //       const emailTemplate = generatePaymentEmail(samplePaymentData);


  //       let mailoption = {
  //         from: EMAIL_SENDER,
  //         to: userEmail,
  //         subject: 'PaymentRemainderService',
  //         html: emailTemplate,

  //       };

  //       Sender.sendMail(mailoption, async (error, data) => {
  //         if (error) {
  //           console.error("Failed To Send Email to: ", mailoption.to);
  //         } else {
  //           console.log("Email Successfully Sent to : ", data.envelope.to);

  //           // update 
  //           await updateNotificationServicePayment(id, 'SUCCESS');
  //         }

  //       });

  //     });


  //   } catch (error) {
  //     console.log("Something Went wrong in while getting paymentTansaction", error);
  //     throw error;
  //   }
  // });

  // // ticket Confirm notification 
  // cron.schedule("*/1 * * * * ", async () => {
  //   // every two minute
  //   try {
  //     console.log("sending  confirm Orders at every 1 min ...... ")

  //     // 1. get unsent data from the paymentTransactoin
  //     const alldata = await getPendingMailServiceTicket();
  //     // console.log('all DAta => ',alldata);
  //     alldata.map(({ dataValues }) => {
  //       const {
  //         id,
  //         orderId,
  //         customerName,
  //         email,
  //         orderItems,
  //         shipping_fee,
  //         tax,
  //         deliveryEstimatedDate,
  //         transactionId,
  //         notificationTime,
  //         amount,
  //         currency,
        
  //       } = dataValues;

  //       const samplePaymentData = {
  //         orderId,
  //          id,
  //         customerName,
  //         email,
  //         orderItems,
  //         shipping_fee,
  //         tax,
  //         deliveryEstimatedDate,
  //         transactionId,
  //         notificationTime,
  //         amount,
  //         currency,
  //       };

  //       const emailTemplate = generateTicketEmail(samplePaymentData);


  //         let mailoption = {
  //         from: EMAIL_SENDER,
  //         to: samplePaymentData.email,
  //         subject: 'Ticket Confirm Notification',
  //         html: emailTemplate,
  //       };

  //       Sender.sendMail(mailoption, async (error, data) => {
  //         if (error) {
  //           console.error("Failed To Send Email to: ", mailoption.to);
  //         } else {
  //           console.log("Email Successfully Sent to : ", data.envelope.to);
  //           // update 
  //           await updateNotificationServiceTicket(id, 'SUCCESS');
  //         }
  //       });

  //     })



  //   } catch (error) {
  //     console.log("Something Went wrong in while sending confirm ticket", error);
  //     throw error;
  //   }
  // });




};

module.exports = setUptask;
