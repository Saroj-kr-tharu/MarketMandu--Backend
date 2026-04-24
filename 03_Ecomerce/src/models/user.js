'use strict';
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
      // define association here
          User.hasMany(models.Order, {
            foreignKey: 'userId',
            as: 'orders'
          });

         
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },

    username: {
          type: DataTypes.STRING,
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
  return User;
};