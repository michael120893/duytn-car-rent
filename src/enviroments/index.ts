import * as dotenv from 'dotenv';
dotenv.config();

const NODE_ENV: string = process.env.NODE_ENV || 'dev';

const DATABASE_USER_NAME: string = process.env.DATABASE_USER_NAME;
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD;
const DATABASE_NAME: string = process.env.DATABASE_NAME;
const DATABASE_HOST: string = process.env.DATABASE_HOST;
const DATABASE_PORT: number = parseInt(process.env.DATABASE_PORT);
const REDIS_HOST: string = 'redis-12259.c252.ap-southeast-1-1.ec2.cloud.redislabs.com';
const REDIS_PORT: number = 12259;

const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET;

const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY;
const SENDGRID_REGISTER_ACCOUNT_TEMPLATE_ID: string =
  process.env.SENDGRID_REGISTER_ACCOUNT_TEMPLATE_ID;
const SENDGRID_PLACE_ORDER_TEMPLATE_ID: string =
  process.env.SENDGRID_PLACE_ORDER_TEMPLATE_ID;
const SENDGRID_SUPPORT_EMAIL: string = process.env.SENDGRID_SUPPORT_EMAIL;

const ADMIN_USER_EMAIL: string = process.env.ADMIN_USER_EMAIL;
const ADMIN_USER_PASSWORD: string = process.env.ADMIN_USER_PASSWORD;

export {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER_NAME,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  SENDGRID_API_KEY,
  SENDGRID_PLACE_ORDER_TEMPLATE_ID,
  SENDGRID_REGISTER_ACCOUNT_TEMPLATE_ID,
  SENDGRID_SUPPORT_EMAIL,
  ADMIN_USER_EMAIL,
  ADMIN_USER_PASSWORD
};
