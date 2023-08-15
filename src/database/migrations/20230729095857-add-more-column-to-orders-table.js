'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'Orders',
          'payment_status_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'PaymentStatuses',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {t },
        ),
        queryInterface.addColumn(
          'Orders',
          'payment_method_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'PaymentMethods',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'coupon_id',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: 'Coupons',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'pick_up_city_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Cities',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'drop_off_city_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Cities',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'total',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'sub_total',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'discount',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'billing_name',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'billing_phone_number',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'billing_address',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'Orders',
          'billing_city',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),

        queryInterface.removeColumn('Orders', 'drop_off_location', {
          transaction: t,
        }),
        queryInterface.removeColumn('Orders', 'pick_up_location', {
          transaction: t,
        }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'payment_status_id');
    await queryInterface.removeColumn('Orders', 'payment_method_id');
    await queryInterface.removeColumn('Orders', 'coupon_id');
    await queryInterface.removeColumn('Orders', 'drop_off_city_id');
    await queryInterface.removeColumn('Orders', 'pick_up_city_id');
    await queryInterface.removeColumn('Orders', 'total');
    await queryInterface.removeColumn('Orders', 'sub_total');
    await queryInterface.removeColumn('Orders', 'discount');
    await queryInterface.removeColumn('Orders', 'billing_name');
    await queryInterface.removeColumn('Orders', 'billing_phone_number');
    await queryInterface.removeColumn('Orders', 'billing_address');
    await queryInterface.removeColumn('Orders', 'billing_city');

    await queryInterface.addColumn('Orders', 'drop_off_location', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Orders', 'pick_up_location', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
