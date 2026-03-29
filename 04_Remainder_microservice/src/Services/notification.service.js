

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


  // confirm ticket 
  // async createServiceTicketConfirm(data) {
  //   try {
  //     let finalData = {
  //       email: data.email,
  //       customerName: data.customerName,
  //       orderItems: data.orderItems,
  //       orderId: data.orderId,
  //       shipping_fee: data.shipping_fee,
  //       tax: data.tax,
  //       deliveryEstimatedDate: data.deliveryEstimatedDate,
  //       Subtotal: data.Subtotal,
  //       notificationTime: data.notificationTime,
  //       transactionId: data.transactionId,
  //       amount: data.amount,
  //       currency: data.currency,
  //     };
  //     const res = await ticketconfirmsRepo.create(finalData);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (create)");
  //     throw error;
  //   }
  // }

 

  // async updateNotificationServiceTicket(id, data) {
  //   try {
  //     const res = await ticketconfirmsRepo.updateNotification(id, data);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (update)");
  //     throw error;
  //   }
  // }

  // async deleteDataByStatusRepoTicket(data) {
  //   try {
  //     const res = await ticketconfirmsRepo.deleteDataByStatus(data);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (deleteDataByStatusRepo)");
  //     throw error;
  //   }
  // }

  // // payment notification 
  // async createServicePayment(data) {
  //   try {
  //     let finalData = {
  //       userEmail: data.email,
  //       notificationTime: data.notificationTime,
  //       transitionId: data.transactionId,
  //       amount: data.amount,
  //       gateway: data.gateway,
  //       payment_status: data.status,
  //       currency: data.currency,
  //     };
  //     const res = await paymentNotificationRepo.create(finalData);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (create)");
  //     throw error;
  //   }
  // }

  // async deleteServicePayment(id) {
  //   try {
  //     const res = await paymentNotificationRepo.delete(id);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (delete)");
  //     throw error;
  //   }
  // }

  // async updateServicePayment(id, data) {
  //   try {
  //     const res = await paymentNotificationRepo.update(id, data);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (update)");
  //     throw error;
  //   }
  // }

  // async updateNotificationServicePayment(id, data) {
  //   try {
  //     const res = await paymentNotificationRepo.updateNotification(id, data);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (update)");
  //     throw error;
  //   }
  // }

  // async getByIdServicePayment(data) {
  //   try {
  //     const res = await paymentNotificationRepo.findById(data);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (getByIdService)");
  //     throw error;
  //   }
  // }

  // async getPendingMailServicePayment() {
  //   try {
  //     const res = await paymentNotificationRepo.findPendingMail();
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (getByIdService)");
  //     throw error;
  //   }
  // }

  // async deleteDataByStatusRepoPayment(data) {
  //   try {
  //     const res = await paymentNotificationRepo.deleteDataByStatus(data);
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (deleteDataByStatusRepo)");
  //     throw error;
  //   }
  // }

  // async filterByDateServicePayment(data) {
  //   try {
  //     const res = await paymentNotificationRepo.filterByDateRange(
  //       data.startDate,
  //       data.endDate
  //     );
  //     return res;
  //   } catch (error) {
  //     console.log("Something went wrong in service layer (getByIdService)");
  //     throw error;
  //   }
  // }
  
} 



const notificationService = new NotificationService();
module.exports = notificationService; 