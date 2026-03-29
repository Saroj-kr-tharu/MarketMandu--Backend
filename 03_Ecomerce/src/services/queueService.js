const { REMINDER_BINDING_KEY } = require("../config/serverConfig");
const { createChannel, publishMessage } = require("../utlis/messageQueue");

const  sendMessageToQueueService =   async (data, service) =>  {
    try {
      const channel = await createChannel();
      const payload = {
        data: {
          ...data,
          
        },
        service: service ,
      };

      console.log("Sending data to publish ", payload);

      publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));

      return true;

      
    } catch (error) {
      console.log(
        "Something went wrong in service layer (publish Message to Queue)"
      );
      throw error;
    }
  }

  module.exports = sendMessageToQueueService;