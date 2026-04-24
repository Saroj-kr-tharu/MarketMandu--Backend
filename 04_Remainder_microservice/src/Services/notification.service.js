

const  NotificationRepo  = require("../Repository/notification.repo");
const CurdService = require("./curd.service")

class NotificationService extends CurdService {
  constructor(){
    super(NotificationRepo)
  }

  async PendingMail() {
    try {
      const res = await NotificationRepo.getBydata({status: "PENDING"});
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (PendingMail)");
      throw error;
    }
  }

  async updateByData(whereData , data) {
    try {
      const res = await NotificationRepo.updateBydata(whereData, data);
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (updateByData)");
      throw error;
    }
  }

  async getBydata( data) {
    try {
      const res = await NotificationRepo.getBydata(data);
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (getBydata)");
      throw error;
    }
  }


   async deleteByData( data) {
    try {
      const res = await NotificationRepo.deleteBydata( data); 
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (deleteByData)", error);
      throw error;
    }
  }

  
} 



const notificationService = new NotificationService();
module.exports = notificationService; 