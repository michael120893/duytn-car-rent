'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      discount_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CouponTypes',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      discount_value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      expiration_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
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

    await queryInterface.addIndex('Coupons', ['code']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Coupons');
  }
};