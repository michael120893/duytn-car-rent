'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      car_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      order_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderStatuses',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      drop_off_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      drop_off_location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pick_up_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      pick_up_location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Orders', ['drop_off_date']);
    await queryInterface.addIndex('Orders', ['pick_up_date']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};