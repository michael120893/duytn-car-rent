'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Cars',
      [
        {
          car_type_id: 1,
          car_steering_id: 1,
          car_capacity_id: 4,
          name: 'New MG ZS',
          price: 100000,
          original_price: 100000,
          description: 'Sports car with the best design and acceleration',
          gasoline: 70,
          licence_plates: '07F8-3333',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          car_type_id: 2,
          car_steering_id: 1,
          car_capacity_id: 3,
          name: 'New MG ZS',
          price: 110000,
          original_price: 100000,
          description: 'Sports car with the best design and acceleration',
          gasoline: 80,
          licence_plates: '07F8-1333',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          car_type_id: 3,
          car_steering_id: 1,
          car_capacity_id: 4,
          name: 'New MG ZS',
          price: 140000,
          original_price: 100000,
          description: 'Sports car with the best design and acceleration',
          gasoline: 90,
          licence_plates: '07F8-3332',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          car_type_id: 4,
          car_steering_id: 1,
          car_capacity_id: 4,
          name: 'New MG ZS',
          price: 100000,
          original_price: 100000,
          description: 'Sports car with the best design and acceleration',
          gasoline: 70,
          licence_plates: '07F8-3334',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down (queryInterface, Sequelize) {
    
  }
};
