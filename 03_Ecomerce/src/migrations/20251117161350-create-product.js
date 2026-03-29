'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      description: {
        type: Sequelize.TEXT,
        
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull:false,
        defaultValue: 1,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brand: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      images: {
        type: Sequelize.JSONB 
      },
      ratings: {
        type: Sequelize.FLOAT,
        defaultValue:0,
        
      },
      totalRatings: {
        type: Sequelize.INTEGER,
        
      },
      isActive: {
        type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue:false
        
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
    await queryInterface.dropTable('Products');
  }
};