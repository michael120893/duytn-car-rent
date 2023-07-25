'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CarCapacities', [
      {
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        capacity: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        capacity: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        capacity: 8,
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
