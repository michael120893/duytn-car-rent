'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Coupons', [
      {
        code: 'REGIREGEROFJ',
        discount_type_id: 1,
        discount_value: 10,
        expiration_date: new Date(2023, 12, 30),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        code: 'DQWDWIQDNWQOID',
        discount_type_id: 1,
        discount_value: 10,
        expiration_date: new Date(2023, 12, 30),
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        code: 'WODWQDWQODWQD',
        discount_type_id: 1,
        discount_value: 10,
        expiration_date: new Date(2023, 12, 30),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()

      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
