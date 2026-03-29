const CURD_REPO = require("./curdRepo");
const { Product } = require("../models/index");

const { Op, where } = require("sequelize");

const { AppError, HttpsStatusCodes} = require('../utlis/index')

class UserREpo extends CURD_REPO { 

    constructor(){
        super(Product)
    }

    async deincreaceQunatity (id, qty) { 
        try {
            console.log('id => ', id , ' and qty => ', qty)
            const product = await this.model.findByPk(id  );
            if (!product) {
                throw new Error('Products is not Found');
            }
            if (product.stock < qty) {
                throw new Error('Products Qunatity is less then required ');
            }
            
            const [affectedRows] = await this.model.increment(
                { stock: -qty },
                { where: { id } }
            );
            
            return affectedRows;

        } catch (error) {
            console.log("something went wrong in Repo curd level (deincreaceQunatity) ")
            throw new AppError(
                'RepositoryError',
                'Stock update error',
                'Issue Stock update error in deincreaceQunatity REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }
    

    async deleteById (id) { 
        try {

            console.log('id => ', id)
            //   const res = await this.model.destroy({
            //         where: {
            //         id
            //         },
            //     });

            const res = await this.model.update(
                    { isActive: this.model.sequelize.literal('NOT isActive') },
                    { where: { id } }
                );
            return res;
        } catch (error) {
            console.log("something went wrong in Repo curd level (delete) ")
            throw new AppError(
                'RepositoryError',
                'Cannot delete BY ID ',
                'Issue in deleting By ID in productRepo REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }


      async deleteBulk (ids) { 
        try {

            // console.log('id => ', ids)
            //   const res = await this.model.destroy({
            //          id: {
            //         [Op.in]: ids,
            //         },
            //     });

              const res = await this.model.update(
              { isActive: this.model.sequelize.literal('NOT isActive') },
            { where: { id: { [Op.in]: ids } } }
        );
                // console.log(' res => ', res)
            return res;
        } catch (error) {
            console.log("something went wrong in Repo curd level (deleteBulk) ")
            throw new AppError(
                'RepositoryError',
                'Cannot delete BY ID ',
                'Issue in deleteBulk By ID in productRepo REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }

    async getProductByIdRepo (id) { 
        try {
            const res = await this.model.findOne({
                where: { id }
            });
            return res;
        } catch (error) {
            console.log("something went wrong in Repo curd level (getProductById) ")
            throw new AppError(
                'RepositoryError',
                'Cannot delete BY ID ',
                'Issue in deleting By ID in productRepo REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }


    #createFilter(data){
        let filter = {};

        if(data.category){
            filter.category = data.category
        }

        if (data.title && data.title.trim()) {
            const term = data.title.trim();

            filter[Op.or] = [
                { name: { [Op.like]: `%${term}%` } },
                
                { description: { [Op.like]: `%${term}%` } },
                { brand: { [Op.like]: `%${term}%` } },
                { category: { [Op.like]: `%${term}%` } },
            ];
        }

        if(data.brand){
            filter.brand = data.brand
        }

        if(data.minPrice && data.maxPrice){
            Object.assign(filter, {
                [Op.and]:[
                    { price: { [Op.lte]: data.maxPrice } }, 
                    { price: { [Op.gte]: data.minPrice } },
                ]
            })
        }

        if(data.minPrice){
            Object.assign(filter, {price: {[Op.gte]:data.minPrice} })
        }

        if(data.rating){
            Object.assign(filter, {ratings: {[Op.gte]:data.rating} })
        }

        if(data.maxPrice){
            Object.assign(filter, {price: {[Op.lte]:data.maxPrice} })
        }

        return filter;


    }
    
    async getProPagation (offset, limit, data) { 
        
        try {   
            // console.log('offset ', offset, ' limit ', limit, ' data ', data)
              const filter =  this.#createFilter(data)
            //   console.log('filter generated => ', filter);

                 let order = [];
                if (data && typeof data.sort === 'string') {
                    if (data.sort.toLowerCase() === 'price_asc') {
                    order = [['price', 'ASC']];
                    } else if (data.sort.toLowerCase() === 'price_desc') {
                    order = [['price', 'DESC']];
                    }
                }

                console.log(' order => ', order)
                
              const res = await this.model.findAndCountAll({ where: filter,  offset, limit , order });
              return res;
        } catch (error) {
            console.log("something went wrong in Repo curd level (getProPagation) ")
            throw new AppError(
                'RepositoryError',
                'Cannot fetched product by filter ',
                'Issue in fetching  in productRepo REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }

}


const userRepo = new UserREpo();

module.exports = userRepo;
