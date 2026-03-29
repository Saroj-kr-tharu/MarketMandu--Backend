'use strict';

const bcrypt = require('bcrypt')
const {salt} = require('../config/serverConfig')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    
    }
  }
  OTP.init({

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    code: {
          type: DataTypes.STRING,
          allowNull: false,

      },
      
      expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
  
        },

      used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
  }, {
    sequelize,
    modelName: 'OTP',
  });

   OTP.beforeCreate((otp) => {
      const hash = bcrypt.hashSync(otp.code, salt);
      otp.code = hash;
    });

  return OTP;
};