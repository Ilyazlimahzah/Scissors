"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const getConfig = () => {
    const { PORT = 8000, MONGO_URL, JWT_KEY, baseUrl, } = process.env;
    let config = {
        port: PORT,
        baseUrl,
        jwt: {
            jwtKey: JWT_KEY,
        },
        dataBase: {
            mongo: MONGO_URL,
        },
    };
    return config;
};
exports.getConfig = getConfig;
