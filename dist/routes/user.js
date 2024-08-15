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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const router = express_1.default.Router();
exports.userRouter = router;
router.post('/api/signup', [
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('Email must be valid'),
    (0, express_validator_1.body)('type')
        .trim()
        .optional()
        .isString()
        .withMessage('type must be a string')
        .matches(/^(user|admin)$/)
        .withMessage('type must be either user or admin'),
    (0, express_validator_1.body)('password')
        .trim()
        .isString()
        .withMessage('Password Should be A string')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestErrors = (0, express_validator_1.validationResult)(req);
        if (!requestErrors.isEmpty()) {
            const result = requestErrors
                .array()
                .map((obj) => `${obj.msg}`)
                .join(', ');
            // return res.status(400).json({ errors: requestErrors.array() });
            const error = new Error(result);
            error.status = 400;
            throw error;
        }
        const { email, password } = req.body;
        const userExists = yield user_1.User.findOne({ email });
        if (userExists) {
            const error = new Error('Email already exists');
            error.status = 400;
            throw error;
        }
        const newUser = new user_1.User({
            email,
            password,
            type: req.body.type || 'user',
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({
            id: newUser.id,
            email: newUser.email,
            type: newUser.type,
        }, (0, config_1.getConfig)().jwt.jwtKey, {
            expiresIn: '24h', // Token will expire in 24 hours
        });
        res.status(201).json({ user: newUser, token });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/api/signin', [
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('Email must be valid'),
    (0, express_validator_1.body)('password')
        .trim()
        .isString()
        .withMessage('Password Should be A string')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestErrors = (0, express_validator_1.validationResult)(req);
        if (!requestErrors.isEmpty()) {
            const result = requestErrors
                .array()
                .map((obj) => `${obj.msg}`)
                .join(', ');
            // return res.status(400).json({ errors: requestErrors.array() });
            const error = new Error(result);
            error.status = 400;
            throw error;
        }
        const { email, password } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid email or password');
            error.status = 400;
            throw error;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.status = 400;
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            type: user.type,
        }, (0, config_1.getConfig)().jwt.jwtKey, {
            expiresIn: '24h', // Token will expire in 24 hours
        });
        res.status(200).json({ user, token });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
