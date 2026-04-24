'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
       
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      shippingFee: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      paymentMethod: {
        type: Sequelize.ENUM("COD", "ESEWA", "KHALTI", "STRIPE"),
        allowNull: false,
        defaultValue: "COD"
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
      },
      orderStatus: {
        type: Sequelize.ENUM(
          'pending',
          'confirmed', 
          'processing',
          'shipped',
          'delivered',
          'cancelled',
          'returned'
        ),
        allowNull: false,
        defaultValue: 'pending'
      },
      shippingAddress: {
        type: Sequelize.JSON,
        allowNull: false
      },
      billingAddress: {
        type: Sequelize.JSON,
        allowNull: false
      },
      deliveredAt: {
        type: Sequelize.DATE,
         allowNull: true, 
        defaultValue:null
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true, 
        defaultValue:null
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('Orders');
  }
};