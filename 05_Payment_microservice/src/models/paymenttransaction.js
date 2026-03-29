'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paymentTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  paymentTransaction.init({
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    paymentMethod: {
      type: DataTypes.ENUM('ESEWA', 'KHALTI', 'STRIPE', 'COD'),
      allowNull: false
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'npr'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('FAILED', 'SUCCESS', 'PENDING', 'REFUND'),
      allowNull: false,
      defaultValue: 'PENDING'
    },

  }, {
    sequelize,
    modelName: 'paymentTransaction',
    tableName: 'paymentTransactions',
  });
  return paymentTransaction;
};