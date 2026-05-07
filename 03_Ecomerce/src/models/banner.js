'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner.init({
    title: {
        type: DataTypes.STRING,
        allowNull:false
      },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull:false
      },
    redirectUrl: {
        type: DataTypes.STRING,
        allowNull:true
      },

    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },

    priority: {
        type: DataTypes.INTEGER,
        allowNull:false,
       
      },
      
      startDate: {
          type: DataTypes.DATE,
          allowNull:false,
        },
      endDate: {
          type: DataTypes.DATE,
          allowNull:false,
        },
   

  }, {
    sequelize,
    modelName: 'Banner',
  });
  return Banner;
};