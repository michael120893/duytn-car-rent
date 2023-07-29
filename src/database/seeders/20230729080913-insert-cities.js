'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Cities',
      [
        {
          city: 'Da Nang',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          city: 'Hue',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          city: 'Ha Noi',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          city: 'Sai Gon',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          city: 'Dak Lak',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          city: 'Da Lat',
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
