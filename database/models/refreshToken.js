'use strict'
const { Model } = require('sequelize')
const uuid = require('uuid')

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate (models) {
      models.RefreshToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }

  RefreshToken.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuid.v4
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RefreshToken',
    underscored: true,
    tableName: 'refresh_tokens'
  })
  return RefreshToken
}
