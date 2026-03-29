'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        onDelete: 'CASCADE'
      })

       OrderItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'RESTRICT'
      });
    

    }
  }
  OrderItem.init({

      orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

      productName: {
          type: DataTypes.STRING,
          allowNull: false,

      },
      productPrice: {
          type: DataTypes.FLOAT,
          allowNull: false,

      },

      quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,

      },

      total: {
          type: DataTypes.FLOAT,
          allowNull: false,

      },

    
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};