
const notificationService = require("./notification.service");

const subscribeEvent = async (payload) => {
  try {
    let service = payload.service;
    let data = payload.data;


    switch (service) {
      case "CREATE_NOTIFICATION":
        await notificationService.createService(data);
      break;

      default:
        break;
    }

    // return res;
  } catch (error) {
    console.log("Something went wrong in service layer (subscribeEvent)");
    throw error;
  }
};


module.exports = {subscribeEvent}