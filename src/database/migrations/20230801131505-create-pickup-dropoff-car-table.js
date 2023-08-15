'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PickupDropoffCars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      car_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      pickup_city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      dropoff_city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PickupDropoffCars');
  },
};
