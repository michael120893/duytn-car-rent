'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cars', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      car_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CarTypes',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      car_steering_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CarSteerings',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      car_capacity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CarCapacities',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gasoline: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      original_price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      licence_plates: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Cars', ['name']);
    await queryInterface.addIndex('Cars', ['price']);
    await queryInterface.addIndex('Cars', ['gasoline']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cars');
  }
};