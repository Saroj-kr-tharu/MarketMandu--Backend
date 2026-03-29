const NotificationTemplateRepo = require("../Repository/notification.template.repo");
const CurdService = require("./curd.service")

class NotificationTemplateService extends CurdService {
  constructor(){
    super(NotificationTemplateRepo)
  }

  async updateByData(id , data) {
    try {
      const res = await NotificationTemplateRepo.updateBydata(id, data);
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (updateByData)");
      throw error;
    }
  }


  async getBydata( data) {
    try {
      const res = await NotificationTemplateRepo.getBydata(data);
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (getBydata)");
      throw error;
    }
  }
  
} 



const notificationTemplateService = new NotificationTemplateService();
module.exports = notificationTemplateService; 