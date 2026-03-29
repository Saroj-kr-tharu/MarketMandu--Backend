'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  Notification.init({
      userId: {
          type: DataTypes.STRING,
          allowNull: false,
          index: true
        },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      eventType: {
        type: DataTypes.ENUM(
          'USER_REGISTERED',
          'FORGOT_PASSWORD',
          'RESET_PASSWORD',
          'WALLET_CREDITED',
          'WITHDRAW_REQUESTED',
          'WITHDRAW_APPROVED',
          'WITHDRAW_REJECTED',
          'CONTEST_WON'
        ),
        allowNull: false
      },

      channel: {
        type: DataTypes.ENUM('EMAIL', 'SMS', 'PUSH'),
        allowNull: false,
        defaultValue: 'EMAIL'
      },

      referenceType: {
        type: DataTypes.STRING,
        allowNull: true
      },

      referenceId: {
        type: DataTypes.STRING,
        allowNull: true
      },

      payload: {
        type: DataTypes.JSONB,
        allowNull: true
  
      },

      status: {
        type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },

      retryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },

      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true
      },

      sentAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['eventType'] },
      { fields: ['status'] }
    ]
  });
  return Notification;
};