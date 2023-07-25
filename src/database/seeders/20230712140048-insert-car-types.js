'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CarTypes', [
      {
        type: "Sport",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: "SUV",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: "MPV",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: "Sedan",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: "Coupe",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: "Hatchblack",
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
