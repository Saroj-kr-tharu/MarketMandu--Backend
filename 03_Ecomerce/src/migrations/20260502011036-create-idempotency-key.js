'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IdempotencyKeys', {
      
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
   key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    operation: {
      type: Sequelize.STRING,
      allowNull: false
      
    },
    requestHash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    responseSnapshot: {
      type: Sequelize.JSON,
      allowNull:false
    },
    status: {
      type: Sequelize.ENUM('IN_PROGRESS', 'SUCCESS', 'FAILED'),
      defaultValue: 'IN_PROGRESS'
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
    await queryInterface.dropTable('IdempotencyKeys');
  }
};