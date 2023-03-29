'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'mime', {
      type: Sequelize.STRING(128),
      allowNull: true
    })
    await queryInterface.addColumn('users', 'bucket', {
      type: Sequelize.STRING(128),
      allowNull: true
    })
    await queryInterface.addColumn('users', 's3_key', {
      type: Sequelize.STRING(128),
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'mime')
    await queryInterface.removeColumn('users', 'bucket')
    await queryInterface.removeColumn('users', 's3_key')
  }
}
