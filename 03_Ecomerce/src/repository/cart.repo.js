const { Cart, CartItem, Product } = require("../models/index");
const { AppError, HttpsStatusCodes } = require("../utlis/index");
const CURD_REPO = require("./curd.repo");

class CartRepo extends CURD_REPO {
  constructor() {
    super(Cart);
  }
  
  

  // get cart with item
  async getCartById(userId) {
    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
              },
            ],
          },
        ],
      });
      return cart;
    } catch (error) {
      console.log("something went wrong in cartRepo level  (create) ", error);
      throw new AppError(
        "RepositoryError",
        "Cannot create  ",
        "Issue in Creating in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // clear cart
  async destory(cart) {
    try {
      await CartItem.destroy({ where: { cartId: cart.id } });
      return true;
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level  (clearCart) ",
        error,
      );
      throw new AppError(
        "RepositoryError",
        "Cannot create  ",
        "Issue in Creating in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // getorCreateCart
  async getOrCreateCart(userId) {
    try {
      let cart = await Cart.findOne({ where: { userId } });
      if (!cart) cart = await Cart.create({ userId });

      return cart;
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level  (clearCart) ",
        error,
      );
      throw new AppError(
        "RepositoryError",
        "Cannot create  ",
        "Issue in Creating in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // add products to cart items
  async addItem(cart, productId, quantity = 1, price) {
    try {
      const [item, created] = await CartItem.findOrCreate({
        where: { cartId: cart.id, productId },
        defaults: { quantity, price },
      });

      if (!created) {
        item.increment("quantity", { by: quantity });
        await item.save();
      }
      return item;
    } catch (error) {
      console.log("something went wrong in Repo curd level  (addItem) ", error);
      throw new AppError(
        "RepositoryError",
        "Cannot add Item   ",
        "Issue in Creating in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // remove cart item
  async removeItem(cartItemId) {
    try {
      const item = await CartItem.findByPk(cartItemId);
      if (!item) return "Item not found";
      await item.destroy();
      return {
        done: true,
        ...item,
      };
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level  (removeItem) ",
        error,
      );
      throw new AppError(
        "RepositoryError",
        "Cannot create  ",
        "Issue in Creating in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeItemBulk(cartItemIds) {
    try {
      const deletedCount = await CartItem.destroy({
        where: { id: cartItemIds },
      });
      return {
        done: true,
        deletedCount,
      };
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level (removeItemBulk)",
        error,
      );
      throw new AppError(
        "RepositoryError",
        "Cannot remove items",
        "Issue in bulk remove in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async BulkupdateItem(itemsToUpdate) {
    try {
      
      const results = [];
      for (const { cartItemId, quantity, selected = false } of itemsToUpdate) {
        const item = await CartItem.findByPk(cartItemId);
            if (!item) {
            results.push({ cartItemId, error: "Item not found" });
            continue;
            }
        item.quantity = quantity;
        item.selected = selected;
        await item.save();
        results.push({ cartItemId, updated: true, item });
      }
      return results;
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level (BulkupdateItem)",
        error,
      );
      throw new AppError(
        "RepositoryError",
        "Cannot bulk update",
        "Issue in bulk update in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update quantity
  async updateItem(cartItemId, quantity, selected = false) {
    try {
      const item = await CartItem.findByPk(cartItemId);
      if (!item) return "Item not found";
      item.quantity = quantity;
      item.selected = selected;
      await item.save();
      return item;
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level  (removeItem) ",
        error,
      );
      throw new AppError(
        "RepositoryError",
        "Cannot create  ",
        "Issue in Creating in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // checkout now
  async checkout(userId) {
    try {
      // Get cart with items
      const cart = await this.getCartById(parseInt(userId));
      if (!cart || !cart.items || cart.items.length === 0) {
        return "Cart is empty";
      }

      const selectedItems = cart.items.filter((item) => item.selected);

      // Calculate total price
      let totalPrice = 0;
      selectedItems.forEach((item) => {
        totalPrice += item.price * item.quantity;
      });

      // Example shipping fee logic
      const shippingFee = 50; // Fixed fee, adjust as needed

      // Return summary
      return {
        items: selectedItems,
        totalPrice,
        shippingFee,
        grandTotal: totalPrice + shippingFee,
      };
    } catch (error) {
      console.log(
        "something went wrong in Repo curd level  (checkout) ",
        error,
      );
      throw new AppError(
        "RepositoryError",
        "Cannot checkout  ",
        "Issue in checkout in CURD REPO",
        HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

const cartRepo = new CartRepo();

module.exports = cartRepo;
