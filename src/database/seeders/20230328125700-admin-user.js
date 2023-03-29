'use strict'

const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
    await queryInterface.bulkInsert('users',
      [
        {
          id: '9873330e-6211-45b1-beb6-d2e951716f5a',
          username: 'admin',
          email: 'admin@frownee.com',
          created_at: new Date(),
          password: await bcrypt.hash('admin', 10)
        }
      ])
  },

  async down (queryInterface, Sequelize) {
    /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
  }
}
