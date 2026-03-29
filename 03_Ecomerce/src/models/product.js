'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.OrderItem, {
        foreignKey: 'productId',
        onDelete: 'RESTRICT'
      });

      Product.hasMany(models.CartItem, {
        foreignKey: 'productId',
        onDelete: 'RESTRICT',
         as: "cartItems"
      });
    }
  }
  Product.init({
    name: {
          type: DataTypes.STRING,
          allowNull: false,

      },
    description: {
          type: DataTypes.TEXT,
          allowNull: false,

      },
    category: {
          type: DataTypes.STRING,
          allowNull: false,

      },
    price: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 1

      },
    brand: {
          type: DataTypes.STRING,
          allowNull: false,

      },
    stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue:0,

      },
    images: {
          type: DataTypes.JSON,
          allowNull: false,

      },
    ratings: {
          type: DataTypes.FLOAT,
          allowNull: false,

      },
    totalRatings: {
          type: DataTypes.INTEGER,
          allowNull: false,

      },
    isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue:false

      },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};