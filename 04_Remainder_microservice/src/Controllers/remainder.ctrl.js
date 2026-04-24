const notificationTemplateService = require("../Services/notification.template.service");
const { responseHandler, asyncHandler } = require("../utlis");
const { SucessCode } = require("../utlis/Errors/https_codes");


class NotificationTemplateCtrl {

  createCtrl = asyncHandler( 
      async (req,res) => {
         const datares = req.body;
          const response = await notificationTemplateService.createService(datares);
          return responseHandler.success(res, response, "Successfully to Create", SucessCode.OK)
      } 
  );

  deleteCtrl = asyncHandler( 
      async (req,res) => {
        const {templateId} = req.params;
        const response = await notificationTemplateService.deleteService(templateId);
        return responseHandler.success(res, response, "Successfully to Delete", SucessCode.OK)
      } 
  );
  
  updateCtrl = asyncHandler( 
      async (req,res) => {
        const {templateId} = req.params;
        const data = req?.body; 
        const response = await notificationTemplateService.updateService(templateId, data);
        return responseHandler.success(res, response, "Successfully to Update", SucessCode.OK)
      } 
  );
  
  getAll = asyncHandler( 
      async (req,res) => {
        const response = await notificationTemplateService.getAllService();
        return responseHandler.success(res, response, "Successfully To GetAll ", SucessCode.OK)
      } 
  );
  


}


const notifiactionTemplateCtrl = new NotificationTemplateCtrl();
module.exports = notifiactionTemplateCtrl; 





