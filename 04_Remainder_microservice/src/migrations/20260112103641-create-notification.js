'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
          type: Sequelize.UUID,
          allowNull: false,
          index: true
        },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
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

      referenceType: {
        type: Sequelize.STRING,
        allowNull: true
      },

      referenceId: {
        type: Sequelize.STRING,
        allowNull: true
      },

      payload: {
        type: Sequelize.JSONB,
        allowNull: true
  
      },

      status: {
        type: Sequelize.ENUM('PENDING', 'SENT', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },

      retryCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      scheduledAt: {
        type: Sequelize.DATE,
        allowNull: true
      },

      sentAt: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('notifications');
  }
};