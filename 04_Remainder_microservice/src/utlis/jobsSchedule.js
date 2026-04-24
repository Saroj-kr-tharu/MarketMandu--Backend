const cron = require("node-cron");

const { Sender, } = require("../config/email.config");
const { EMAIL_SENDER, FORTEND_URL } = require('../config/server.config');
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
        // console.log(" mail => ", emailInfo.eventType)
     
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
              console.log("result => ", res)
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
              app_url: FORTEND_URL
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
      console.log("Something Went wrong in job schedule", error);
      throw error;
    }
  });


  cron.schedule("*/2 * * * * ", async () => {
    // every two minute

    try {
      console.log( " ... Deleteing  Sucess data at 2 minute......") 
      await notificationService.deleteByData({ status: "SENT" });
    } catch (error) {
      console.log("Something Went wrong in job schedule", error);
      throw error;
    }
  });



  };

module.exports = setUptask;
