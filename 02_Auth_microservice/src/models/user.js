'use strict';

const bcrypt = require('bcrypt')
const {salt} = require('../config/server.config')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },

    username: {
          type: DataTypes.STRING,
    },

    role: {
      type: DataTypes.ENUM("CUSTOMER", "ADMIN"),
      allowNull: false,
      defaultValue:"CUSTOMER"

    },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    password: {
          type: DataTypes.STRING,
          allowNull: false,  
      },

    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("CUSTOMER", "ADMIN"),
      allowNull: false,
      defaultValue:"CUSTOMER"

    },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeValidate((user) => {
    if (user.email) user.email = user.email.toLowerCase();
  });

  User.beforeCreate((user) => {
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  });

  return User;
};