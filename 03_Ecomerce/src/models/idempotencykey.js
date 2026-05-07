'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IdempotencyKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IdempotencyKey.init({
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
   key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    operation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requestHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    responseSnapshot: {
      type: DataTypes.JSON,
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM('IN_PROGRESS', 'SUCCESS', 'FAILED'),
      defaultValue: 'IN_PROGRESS'
    }
  }, {
    sequelize,
    modelName: 'IdempotencyKey',
  });
  return IdempotencyKey;
};