const Service = require('./curd.service');
const {IdempotancyKeyRepo} = require('../repository/index');


class IdempotencyKeyService extends Service {
  constructor() {
    super(IdempotancyKeyRepo);
  }

  async getByData(data) {
    try {
      const res = await IdempotancyKeyRepo.getBydata(data);
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (getByData)");
      throw error;
    }
  }

  async updateByData(where, updateData,) {
    try {
      
      const res = await IdempotancyKeyRepo.updateBydata(where, updateData);
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (updateByData)");
      throw error;
    }
  }
  async updateByData(where, updateData,) {
    try {
      
      const res = await IdempotancyKeyRepo.updateBydata(where, updateData);
      return res;
    } catch (error) {
      console.log("Something went wrong in service layer (updateByData)");
      throw error;
    }
  }

  async findOrCreateService(query) {
    try {
      const { where, defaults } = query;
      const res = await IdempotancyKeyRepo.findORCreate(where, defaults);
      return res; 
    } catch (error) {
      console.error("Something went wrong in service layer (findOrCreateService)", error);
      throw error;
    }
  }


}

const idempotencyKeyService = new IdempotencyKeyService();
module.exports = idempotencyKeyService;