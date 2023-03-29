'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      token: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('refreshTokens')
  }
}
