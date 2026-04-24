const CurdService = require('./curd.service')
const  USER_REPO = require('../repository/user.repo')
const  cartRepo = require('../repository/cart.repo')

const {  ServiceError} = require('../utlis/index');

class cartService extends CurdService {
    constructor(){
        super(USER_REPO)
    }

    async getCartById(userId){
        try {
            const  response =  cartRepo.getCartById(userId);
            return response;

        } catch (error) {
            console.log("something went wrong in service curd level  (getCart) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError()
        }
    }

    async addItem(userId, productId, quantity, price){
        try {
            // check the cart is existed or have to create new 
            const cart =  await cartRepo.getOrCreateCart(userId);
            const  response =  cartRepo.addItem(cart, productId, quantity, price);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (addItem) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


    async clearCart(userId){
        try {
                const cart = await cartRepo.getOrCreateCart(userId);
                const  response =  cartRepo.destory( cart);
                return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (clearCart) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError()
        }
    }

    async removeItem(cartItemId){
        try {
            const  response =  cartRepo.removeItem(cartItemId);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (cartItemId) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async updateItem(cartItemId, quantity, selected){
        try {
            const  response =  cartRepo.updateItem(cartItemId, quantity, selected);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (updateItem) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async deleteItemBluk(cartItemIds){
        try {
            if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
                        return 'No item IDs provided';
            }
            const  response =  cartRepo.removeItemBulk(cartItemIds);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (updateItem) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

      async updateItemBluk(cartItemIds){
        try {
            if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) 
                return "No items provided";
            
            const  response =  cartRepo.BulkupdateItem(cartItemIds);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (updateItemBluk) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }
    
    async checkout(userId){
        try {
            const  response =  cartRepo.checkout(userId);
            return response;
        } catch (error) {
            console.log("something went wrong in service curd level  (checkout) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }


}

const cartservice= new cartService()

module.exports = cartservice;