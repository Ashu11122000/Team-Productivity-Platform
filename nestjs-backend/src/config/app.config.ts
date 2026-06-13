/* eslint-disable prettier/prettier */
export default () => ({
    nodeEnv: process.env.NODE_ENV || 'development',

    port: parseInt(process.env.PORT || '3001', 10),

    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
});