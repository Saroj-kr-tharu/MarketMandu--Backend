const { NotificationTemplate } = require("../models/index");
const { Op, where } = require("sequelize");
const CurdRepo  = require("./curd.repo")

class NotificationTemplateRepo extends CurdRepo {
    constructor() {
      super(NotificationTemplate);
    }

  async getBydata(data) {
    try {
      const res = await this.model.findOne({ where: data });
      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (getBydata) ");
      throw error;
    }
  }
  
  async updateBydata(where, updateData) {
    try {
      const res = await this.model.update(updateData, { where });
      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (updateBydata)");
      throw error;
    }
  }

  async deleteDataByStatus(status){
      try {
        const res = await NotificationTickets.destroy({
          where: {
            status,
          },
        });
        return res;
      } catch (error) {
        console.log("Something went wrong in Repo level (delete) ");
        throw error;
      }
  }

  async findPendingMail() {
    try {
      const res = await NotificationTickets.findAll({
        where: {
          status: "PENDING",
          notificationTime: {
            [Op.lte]: new Date(),
          },
        },
      });
      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (findPending) ");
      throw error;
    }
  }

  async filterByDateRange(firstDate, endDate) {
    try {
      const res = await NotificationTickets.findAll({
        where: {
          notificationTime: { [Op.between]: [firstDate, endDate] },
        },
      });
      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (create) ");
      throw error;
    }
  }

  async updateNotification(id, dataStatus) {
    try {
      // console.log("repo ", id, data);

      const res = NotificationTickets.update(
        { status: dataStatus },
        {
          where: {
            id,
          },
        }
      );

      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (create) ");
      throw error;
    }
  }

}

const notificationTemplateRepo = new NotificationTemplateRepo();
module.exports = notificationTemplateRepo;
