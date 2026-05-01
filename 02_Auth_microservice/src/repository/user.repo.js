const CURD_REPO = require("./curd.repo");
const { User } = require("../models/index");


class UserREpo extends CURD_REPO {
  constructor() {
    super(User);
  }


  async getBydata(data) {
    try {
     
      const res = await this.model.findOne({
         attributes: ['id', 'role', 'username', 'isActive','email','createdAt','updatedAt'],
         where: data 
        });
      
      return res;
    } catch (error) {
      console.log("Something went wrong in Repo level (getBydata) ");
      throw error;
    }
  }


  async getByEmail(email) {
    try {
      const res = await User.findOne({
        where: { email },
      });
      return res;
    } catch (error) {
      console.log(
        "something went wrong in  user Repo curd level (getByEmail) "
      );
      throw error; 
     
    }
  }

  #createFilter(data) {
    let filter = {};

    if (data.email) {
      filter.email = data.email;
    }

    if (data.username) {
      filter.username = data.username;
    }

    if (data.role) {
      filter.role = data.role;
    }

    return filter;
  }

  async getALLUserProPagation(offset, limit, data) {
    try {
      const filter = this.#createFilter(data);
      //  console.log(filter, 'data => ', data )

      const res = await User.findAndCountAll({ 
        attributes: ['id', 'role', 'username', 'isActive','email','createdAt','updatedAt'],
        where: filter, 
        offset, 
        limit 
      });
      return res;
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level (getALLUserProPagation) "
      );
      throw error; 
    }
  }

  async bulkUpdateByid(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return "No IDs provided";
      }
      const results = [];
      const users = await User.findAll({ where: { id: ids } });
      for (const user of users) {
        user.isActive = !user.isActive;
        await user.save();
        results.push({ id: user.id, isActive: user.isActive });
      }
      // Handle IDs not found
      const foundIds = users.map((u) => u.id);
      ids.forEach((id) => {
        if (!foundIds.includes(id)) {
          results.push({ id, error: "User not found" });
        }
      });
      return results;
    } catch (error) {
      console.log( "something went wrong in Repo curd level (getALLUserProPagation) ");
      throw error; 
    }
  }
}

const userRepo = new UserREpo();

module.exports = userRepo;
