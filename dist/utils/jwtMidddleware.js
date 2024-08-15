"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header (e.g., Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify the token using your secret key
        const decoded = jsonwebtoken_1.default.verify(token, (0, config_1.getConfig)().jwt.jwtKey);
        // Assign the decoded token to req.user
        req.user = decoded;
        // Continue to the next middleware/route handler
        next();
    }
    catch (err) {
        console.error(err);
        // If the token is invalid, send a 401 Unauthorized response
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.verifyToken = verifyToken;
