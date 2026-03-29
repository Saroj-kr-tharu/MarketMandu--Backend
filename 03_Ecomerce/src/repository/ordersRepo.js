const CURD_REPO = require("./curdRepo");
const { Order, User, Product, OrderItem } = require("../models/index");
const { AppError, HttpsStatusCodes} = require('../utlis/index')

class OrderRepo extends CURD_REPO { 

    constructor(){
        super(Order)
    }

    async getByUserId (offset, limit,  id ) { 
        try {
            
              const orders = await Order.findAll({
                where: {
                    userId:id,
                },

                
                include: [
                    {
                    model: User,
                    as: 'user', 
                    attributes: ['id', 'username', 'email']
                    },
                    {
                    model: OrderItem,
                    include: [
                        {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'stock']
                        }
                    ]
                    }
                ], 

                offset: parseInt(offset) || 0,
                limit: parseInt(limit) || 10,
                order: [['createdAt', 'DESC']]

                });

                return orders;

        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot fetched ALL Order BY User Id  ',
                'Issue in updating By ID in OrderRepo',
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

            );
        }
    }

     async getOrdersByOrderNo (orderNo ) { 
        try {
                // console.log('order => ', orderNo)
              const orders = await Order.findAll({
                where: {
                    orderNumber:orderNo,
                },
                include: [
                    {
                    model: User,
                    as: 'user', 
                    attributes: ['id', 'username', 'email']
                    },
                    {
                    model: OrderItem,
                    include: [
                        {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'stock']
                        }
                    ]
                    }
                ], 

              
                raw: false,
                nest: true

                });

                return orders;

        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot fetched ALL Order BY User Id  ',
                'Issue in updating By ID in OrderRepo',
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

            );
        }
    }

    async getAllOrders (offset, limit) { 
        try {
              const orders = await Order.findAll({
                include: [
                    {
                    model: User,
                    as: 'user', 
                    attributes: ['id', 'username', 'email']
                    },
                    {
                    model: OrderItem,
                    include: [
                        {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'stock']
                        }
                    ]
                    }
                ], 

                offset: parseInt(offset) || 0,
                limit: parseInt(limit) || 10,
                order: [['createdAt', 'DESC']]

                });

                return orders;

        } catch (error) {
            console.log("something went wrong in Repo curd level (delete) ")
            throw new AppError(
                'RepositoryError',
                'Cannot fetched all orders ',
                'Issue in fetching all orders in OrderRepo REPO',
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

            );
        }
    }



     async getAllOrdersWithoutFilter () { 
        try {
              const orders = await Order.findAll({
                include: [
                    {
                    model: User,
                    as: 'user', 
                    attributes: ['id', 'username', 'email']
                    },
                    {
                    model: OrderItem,
                    include: [
                        {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'stock']
                        }
                    ]
                    }
                ], 

              });
                // console.log('oredes => ', orders)
                return orders;

        } catch (error) {
            console.log("something went wrong in Repo curd level (getAllOrdersWithoutFilter) ")
            throw new AppError(
                'RepositoryError',
                'Cannot fetched all orders ',
                'Issue in fetching all orders in OrderRepo REPO',
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

            );
        }
    }


 
    
    async updateOrdersByOrderNo (data, orderNumber) { 
        try {
               const res = await this.model.update(data, { where : {orderNumber } } );

                return res;

        } catch (error) {
            console.log("something went wrong in Repo curd level (updateOrdersByTransId) ")
            throw new AppError(
                'RepositoryError',
                'Cannot fetched all orders ',
                'Issue in updateOrdersByTransId all orders in OrderRepo REPO',
                HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

            );
        }
    }


    

}


const ordersRepo = new OrderRepo();

module.exports = ordersRepo;
