'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'billing_name');
    await queryInterface.removeColumn('Orders', 'billing_phone_number');
    await queryInterface.removeColumn('Orders', 'billing_address');
    await queryInterface.removeColumn('Orders', 'billing_city');
    await queryInterface.dropTable('UserAddresses')
  },

  async down(queryInterface, Sequelize) {},
};
