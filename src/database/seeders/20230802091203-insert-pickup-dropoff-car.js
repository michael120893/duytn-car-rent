'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'PickupDropoffCars',
      [
        {
          car_id: 1,
          pickup_city_id:1,
          dropoff_city_id:2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          car_id: 1,
          pickup_city_id:2,
          dropoff_city_id:2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          car_id: 2,
          pickup_city_id:2,
          dropoff_city_id:3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          car_id: 3,
          pickup_city_id:1,
          dropoff_city_id:2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          car_id: 3,
          pickup_city_id:3,
          dropoff_city_id:3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
