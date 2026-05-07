const { IdempotencyKey } = require("../models/index");
const CurdRepo = require('./curd.repo');

class IdempotancyKeyRepo extends CurdRepo {
  constructor() {
    super(IdempotencyKey);
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
      // console.log("where => ", where, " updatedData =>  ", updateData)
      const res = await this.model.update(updateData, { where });
      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (updateBydata)");
      throw error;
    }
  }
  async updateBydata(where, updateData) {
    try {
      // console.log("where => ", where, " updatedData =>  ", updateData)
      const res = await this.model.update(updateData, { where });
      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (updateBydata)");
      throw error;
    }
  }
  
  async findORCreate(where, defaults) {
    try {
     
      const [instance, created] = await this.model.findOrCreate({
        where,
        defaults,
      });
      return [instance, created];
    } catch (error) {
      console.error("Something went wrong in Repo level (findOrCreateService)", error);
      throw error;
    }
  }

}


const idempotancyKeyRepo = new IdempotancyKeyRepo();
module.exports = idempotancyKeyRepo;