const CURD_REPO = require("./curdRepo");
const { Order } = require("../models/index");
const { AppError, HttpsStatusCodes} = require('../utlis/index')


class OrderItemsRepo extends CURD_REPO { 

    constructor(){
        super(Order)
    }

    async deleteById (id) { 
        try {
              const res = await this.model.destroy({
                    where: {
                    id
                    },
                });
            return res;
        } catch (error) {
            console.log("something went wrong in Repo curd level (delete) ")
            throw new AppError(
                'RepositoryError',
                'Cannot Delete By Id  ',
                'Issue in updating By ID in OrderItems REPO',
                 HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }


    

}


const orderItemsRepo = new OrderItemsRepo();

module.exports = orderItemsRepo;
