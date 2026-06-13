/* eslint-disable prettier/prettier */
export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
    },
});