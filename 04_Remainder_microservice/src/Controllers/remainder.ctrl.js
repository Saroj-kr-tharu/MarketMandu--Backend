const notificationTemplateService = require("../Services/notification.template.service")


class NotificationTemplateCtrl {
  async createCtrl(req, res) {
    try {
      const datares = req.body;

      const response = await notificationTemplateService.createService(datares);
      return res.status(201).json({
        message: "Successfully to Create a Ticket",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("Something went wrong in Ctrl level (creating)");
      return res.status(501).json({
        message: "Failed to Create a Ticket",
        success: false,
        data: {},
        err: error.message || error,
      });
    }
  }

  async deleteCtrl(req, res) {
    try {
      const {templateId} = req.params;

      const response = await notificationTemplateService.deleteService(templateId);
      return res.status(201).json({
        message: "Successfully to delete a Ticket",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("Something went wrong in Ctrl level (deleting)")
      return res.status(501).json({
        message: "Failed to delete a Ticket",
        success: false,
        data: {},
        err: error.message || error,
      });
    }
  }

  async updateCtrl(req, res) {
    try {
      const {templateId} = req.params;
      const data = req?.body; 

      const response = await notificationTemplateService.updateService(templateId, data);
      return res.status(201).json({
        message: "Successfully to updateCtrl a Ticket",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("Something went wrong in Ctrl level (updateCtrl)");
      return res.status(501).json({
        message: "Failed to delete a Ticket",
        success: false,
        data: {},
        err: error.message || error,
      });
    }
  }


  async getAll(req, res) {
    try {
      const response = await notificationTemplateService.getAllService();
      return res.status(201).json({
        message: "Successfully to get a Ticket by id",
        success: true,
        data: response,
        err: {},
      });
    } catch (error) {
      console.log("Something went wrong in Ctrl level (getingByIdCtrl)");
      return res.status(501).json({
        message: "Failed to get a Ticket By Id",
        success: false,
        data: {},
        err: error.message || error,
      });
    }
  }

}


const notifiactionTemplateCtrl = new NotificationTemplateCtrl();
module.exports = notifiactionTemplateCtrl; 





