'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      CartItem.belongsTo(models.Cart, {
      foreignKey: "cartId",
      onDelete: "CASCADE",
        onUpdate: 'CASCADE',
        as: "cart"
    });

      CartItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
       onDelete: "CASCADE",
        onUpdate: 'CASCADE',
    });




    }
  }
  CartItem.init({
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Carts', 
          key: 'id'
        },
          onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
          references: {
          model: 'Products',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
     
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull:false
      },

      selected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};