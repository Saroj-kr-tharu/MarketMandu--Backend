'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NotificationTemplate.init({
        eventType: {
            type: DataTypes.ENUM(
              'USER_REGISTERED',
              'FORGOT_PASSWORD',
              'RESET_PASSWORD',
              'WALLET_CREDITED',
              'WITHDRAW_REQUESTED',
              'WITHDRAW_APPROVED',
              'WITHDRAW_REJECTED',
              'CONTEST_WON',
          
            ),
            allowNull: false
          },

      channel: {
        type: DataTypes.ENUM('EMAIL', 'SMS', 'PUSH'),
        allowNull: false,
        defaultValue: 'EMAIL'
      },

      subject: {
        type: DataTypes.STRING,
        allowNull: false
      },

      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
 {
   sequelize,
      modelName: 'NotificationTemplate',
      tableName: 'notification_templates',
      timestamps: true,
      indexes: [
        { fields: ['eventType', 'channel'], unique: true }
      ]
  });
  return NotificationTemplate;
};