const { REMINDER_BINDING_KEY } = require("../config/serverConfig");
const { createChannel, publishMessage } = require("../utlis/messageQueue");
const userservice = require("./user.service");

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
      console.log("Something went wrong in service layer (publish Message to Queue)", error);
      throw error;
    }
  }

const subscribeEvent = async (payload) => {
  try {
    let service = payload.service;
    let data = payload.data;
    // console.log(` from ecoormrce service => ${service} '\n' data => ${data}`);
    if(service == 'USER_EVENT_EMIT'){
        const eventType = data?.eventType;
        // console.log("data => ", data , " service => ", service);
        switch(eventType){ 
          case 'UPDATE_USER_SINGLE':
             userservice.userUpdateById(data?.data, data?.id);
          break;
          case 'UPDATE_USER_BULK':
             userservice.bulkUpdateUserId(data?.ids);
          break;
          case 'USER_REGISTERED':
             userservice.upsertData(data);
          break;
        }
    }
    

    // return res;
  } catch (error) {
    console.log("Something went wrong in service layer (subscribeEvent)");
    throw error;
  }
};

  module.exports = {sendMessageToQueueService, subscribeEvent};