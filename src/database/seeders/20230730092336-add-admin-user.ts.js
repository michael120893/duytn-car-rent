'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'admin',
          email: process.env.ADMIN_USER_EMAIL,
          password: process.env.ADMIN_USER_PASSWORD,
          phone: '0772976366',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {},
};
