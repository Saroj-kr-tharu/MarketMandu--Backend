const CurdService = require('./curd.service')
const  {Product_Repo} = require('../repository/index')


class OrdersItemsService extends CurdService {
    constructor(){
        super(Product_Repo)
    }

}

const ordersItemsservice= new OrdersItemsService()

module.exports = ordersItemsservice;