'use strict'

const { Model } = require('sequelize')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate (models) {
      models.User.hasMany(models.RefreshToken, { as: 'refreshTokens' })
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuid.v4
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 64]
      }
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [3, 128]
      }
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    s3Key: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    bucket: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    mime: {
      type: DataTypes.STRING(128),
      allowNull: true
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
    modelName: 'User',
    underscored: true
  })

  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash()
  })

  User.prototype.generatePasswordHash = function () {
    if (this.password) {
      return bcrypt.hash(this.password, 10)
    }
  }

  return User
}
