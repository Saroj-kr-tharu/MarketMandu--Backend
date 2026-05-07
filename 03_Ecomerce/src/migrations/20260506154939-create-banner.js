'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Banners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      imageUrl: {
        type: Sequelize.STRING,
         allowNull:false
      },
      redirectUrl: {
        type: Sequelize.STRING,
         allowNull:false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
         allowNull:false, 
         defaultValue:true
      },
      priority: {
        type: Sequelize.INTEGER,
         allowNull:false
      },
      startDate: {
        type: Sequelize.DATE,
         allowNull:false
      },
      endDate: {
        type: Sequelize.DATE,
         allowNull:false
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
    await queryInterface.dropTable('Banners');
  }
};