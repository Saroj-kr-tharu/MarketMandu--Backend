'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        onDelete: 'CASCADE'
      });

      Order.belongsTo(models.User, {
        foreignKey: 'userId', 
        as: 'user'
      })
     
      
    }
  }
  Order.init({

    userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Users', 
            key: 'id'
          },
      },

      
    orderNumber: {
          type: DataTypes.STRING,
          allowNull: false,
      },

      
    subtotal: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0 

      },

      
    tax: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue:0

      },

      
    shippingFee: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue:0

      },

      
    discount: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue:0

      },

      
    totalAmount: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue:0

      },

      
    paymentMethod: {
          type: DataTypes.ENUM("COD", "ESEWA", "KHALTI", "STRIPE"),
          allowNull: false,
          defaultValue:"COD"

      },

      
    paymentStatus: {
          type: DataTypes.ENUM('pending','paid','failed','refunded'),
          defaultValue: 'pending',
          allowNull: false,

      },

      
    orderStatus: {
          type: DataTypes.ENUM( 
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
          'cancelled',
          'returned'
        ),
          defaultValue: 'pending',
          allowNull: false,

      },

      
    shippingAddress: {
          type: DataTypes.JSON,
          allowNull: false,
          

      },

    billingAddress: {
         type: DataTypes.JSON,
          allowNull: false,
          
      },

    deliveredAt: {
      type:DataTypes.DATE,
      allowNull: true,
      defaultValue:false 

   },

    cancelledAt: {
      type:DataTypes.DATE,
      allowNull: true, 
      defaultValue : null 
    },
    
    isActive: {
      type:DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: 0 ,
    }
   
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};