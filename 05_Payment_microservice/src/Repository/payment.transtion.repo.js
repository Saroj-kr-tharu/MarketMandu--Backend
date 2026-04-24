const { paymentTransaction } = require("../models/index");
const CurdRepo = require('./curd.repo');

class PaymentTransaction_repo extends CurdRepo {
  constructor() {
    super(paymentTransaction);
  }

  async updateByTrans(id, data) {
    try {
      const res = await this.model.update(data, {
        where: {
          transactionId: id,
        },
      });

      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (create) ");
      throw error;
    }
  }

  async getDetailsByTransid(transactionId) {
    try {
      const user = await this.model.findOne({
        where: { transactionId },
      });

      return user;
    } catch (error) {
      console.log("Something went wrong in Repo level (getDetailsByTransid) ");
      throw error;
    }
  }


}


const paymentTransactionRepo = new PaymentTransaction_repo();

module.exports = paymentTransactionRepo;