'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_templates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventType: {
          type: Sequelize.ENUM(
            'USER_REGISTERED',
          'FORGOT_PASSWORD',
          'RESET_PASSWORD',
          'ORDER_CONFIRM',
            
          ),
          allowNull: false
      },

      channel: {
        type: Sequelize.ENUM('EMAIL', 'SMS', 'PUSH'),
        allowNull: false,
        defaultValue: 'EMAIL'
      },

      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },

      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      version: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notification_templates');
  }
};