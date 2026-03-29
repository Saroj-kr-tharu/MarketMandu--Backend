class CurdRepo { 
  constructor(model) {
    this.model = model;
  }

  async create(data, options = {}) {
    try {
      return await this.model.create(data, {
        transaction: options.transaction
      });
    } catch (error) {
      console.log("Repo error (create)");
      throw error;
    }
  }

  async update(id, data, options = {}) {
    try {
      return await this.model.update(data, {
        where: { id },
        transaction: options.transaction
      });
    } catch (error) {
      console.log("Repo error (update)");
      throw error;
    }
  }

  async delete(id, options = {}) {
    try {
      return await this.model.destroy({
        where: { id },
        transaction: options.transaction
      });
    } catch (error) {
      console.log("Repo error (delete)");
      throw error;
    }
  }

  async getAll(options = {}) {
    try {
      return await this.model.findAll({
        transaction: options.transaction
      });
    } catch (error) {
      console.log("Repo error (getAll)");
      throw error;
    }
  }

  async getByid(id, options = {}) {
    try {
      return await this.model.findOne({
        where: { id },
        transaction: options.transaction
      });
    } catch (error) {
      console.log("Repo error (getById)");
      throw error;
    }
  }
}

module.exports = CurdRepo;
