
const notificationService = require("./notification.service");

const subscribeEvent = async (payload) => {
  try {
    let service = payload.service;
    let data = payload.data;

    console.log(`service => ${service} '\n' data => ${data}`);

    switch (service) {
      case "CREATE_NOTIFICATION":
      
        await notificationService.createService(data);
      break;

      default:
        console.log("No  valid event recevied");
        break;
    }

    // return res;
  } catch (error) {
    console.log("Something went wrong in service layer (subscribeEvent)");
    throw error;
  }
};


module.exports = {subscribeEvent}