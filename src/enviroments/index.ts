import * as dotenv from 'dotenv';
dotenv.config();

const NODE_ENV: string = process.env.NODE_ENV || 'dev';

const DATABASE_USER_NAME: string = process.env.DATABASE_USER_NAME;
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD;
const DATABASE_NAME: string = process.env.DATABASE_NAME;
const DATABASE_HOST: string = process.env.DATABASE_HOST;
const DATABASE_PORT: number = parseInt(process.env.DATABASE_PORT);
const REDIS_HOST: string = process.env.REDIS_HOST;
const REDIS_PORT: number  = parseInt(process.env.REDIS_PORT);

const JWT_ACCESS_SECRET: string  = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET: string  = process.env.JWT_REFRESH_SECRET;

export {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USER_NAME,
    NODE_ENV,
    REDIS_HOST,
    REDIS_PORT,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET
};

