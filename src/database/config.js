require('dotenv').config();
module.exports = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect: 'mysql',
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_meta_migration',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_data_seeder',
  dialectOptions: {
    bigNumberStrings: true,
  },
};
