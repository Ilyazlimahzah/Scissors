"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shorten_1 = require("./routes/shorten");
const user_1 = require("./routes/user");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const loggerFunction = (req, res, next) => {
    console.error(`${req.method} to ${req.originalUrl} on this server!`);
    next();
};
app.use(loggerFunction);
app.use(shorten_1.shortenRouter);
app.use(user_1.userRouter);
app.all('*', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next({
        status: 404,
        message: `Can't find  ${req.method} to ${req.originalUrl} on this server!`,
    });
}));
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    console.error(err, `${req.method} to ${req.originalUrl} on this server!`);
    // Send a response with the error status and message
    res.status(status).json({
        status,
        message,
    });
};
app.use(errorHandler);
exports.default = app;
