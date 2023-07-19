'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'PaymentStatuses',
      [
        {
          status: 'Pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          status: 'Paid',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          status: 'Failed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
