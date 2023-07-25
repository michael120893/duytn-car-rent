'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'PaymentMethods',
      [
        {
          method: 'Cash',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          method: 'Credit Card',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          method: 'Debit Card',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          method: 'Paypal',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          method: 'Mobile Wallets',
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
