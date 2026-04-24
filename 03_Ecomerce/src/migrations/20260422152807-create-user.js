'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },

      
      username: {
        type: Sequelize.STRING,
        allowNull: true,
      },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },

  
    role: {
      type: Sequelize.ENUM("CUSTOMER", "ADMIN"),
      allowNull: false,
      defaultValue:"CUSTOMER"
    },

    isActive: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Users');
  }
};