"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const config_1 = require("./utils/config");
function connectMongo(server) {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default
        .connect((0, config_1.getConfig)().dataBase.mongo, {
        dbName: 'URLShortener',
    })
        .then(() => {
        console.log('Connected to MongoDB');
        server.listen((0, config_1.getConfig)().port, () => {
            console.log(`Server is running on http://localhost:${(0, config_1.getConfig)().port}`);
        });
    })
        .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
    });
}
connectMongo(app_1.default);
