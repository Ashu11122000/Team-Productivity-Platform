/* eslint-disable prettier/prettier */
import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',

    host: process.env.DATABASE_HOST,

    port: parseInt(process.env.DATABASE_PORT || '5432', 10),

    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',

    entities: ['dist/**/*.entity{.ts, .js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    subscribers: [],
});

export default AppDataSource;