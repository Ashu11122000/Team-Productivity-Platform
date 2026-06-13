/* eslint-disable prettier/prettier */
import appConfig from "./app.config";
import databaseConfig from "./database.config";
import jwtConfig from "./jwt.config";

export const configuration = [
    appConfig,
    databaseConfig,
    jwtConfig,
];

export {
    appConfig,
    databaseConfig,
    jwtConfig
};