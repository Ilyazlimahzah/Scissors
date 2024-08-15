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
exports.shortenRouter = void 0;
const express_1 = __importDefault(require("express"));
const shorten_1 = require("../models/shorten");
const qrcode_1 = __importDefault(require("qrcode"));
const jwtMidddleware_1 = require("../utils/jwtMidddleware");
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
const config_1 = require("../utils/config");
const router = express_1.default.Router();
exports.shortenRouter = router;
//for user only
router.get('/api/shorten/user', jwtMidddleware_1.verifyToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            const error = new Error('User not found, register again or sign in properly');
            error.status = 400;
            throw error;
        }
        const urls = yield shorten_1.URL.find({ creator: user.id });
        res.status(200).json({ urls });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
//get analytics of shortened urls
router.get('/api/shorten/admin', jwtMidddleware_1.verifyToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = 0 } = req.query;
    try {
        const user = yield user_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user || user.type !== 'admin') {
            const error = new Error('User not found or authorized to view this page');
            error.status = 400;
            throw error;
        }
        const urls = yield shorten_1.URL.find({})
            .skip(Number(page) * 10)
            .limit(10);
        res.status(200).json({ urls });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
//get shortened url by id
router.get('/api/shorten/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const url = yield shorten_1.URL.findOne({ shortUrl: id });
        if (!url) {
            const error = new Error('URL not found');
            error.status = 404;
            throw error;
        }
        url.visitCount += 1;
        url.location.push(req.ip);
        yield url.save();
        res.status(200).json({ url: url.originalUrl });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/api/shorten/qrcode', jwtMidddleware_1.verifyToken, [
    (0, express_validator_1.body)('urlLink')
        .trim()
        .isString()
        .withMessage('urlLink URL Should be A valid string'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requestErrors = (0, express_validator_1.validationResult)(req);
        if (!requestErrors.isEmpty()) {
            const result = requestErrors
                .array()
                .map((obj) => `${obj.msg}`)
                .join(', ');
            const error = new Error(result);
            error.status = 400;
            throw error;
        }
        const user = yield user_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            const error = new Error('User not found, register again or sign in properly');
            error.status = 400;
            throw error;
        }
        const { urlLink } = req.body;
        const urlExists = yield shorten_1.URL.findOne({ urlLink });
        if (!urlExists) {
            const error = new Error('urlLink does not exist');
            error.status = 400;
            throw error;
        }
        const qrCodeDataUrl = yield qrcode_1.default.toDataURL(urlExists.urlLink);
        // Send QR code as an image
        res.status(200).json(qrCodeDataUrl);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/api/shorten', jwtMidddleware_1.verifyToken, [
    (0, express_validator_1.body)('customUrl')
        .trim()
        .optional()
        .isString()
        .withMessage('customUrl must be valid')
        .isLength({ min: 5, max: 20 })
        .withMessage('customUrl must be between 5 and 20 characters')
        .custom((value) => {
        // Check if the customUrl is 'user' or 'admin'
        if (value === 'user' || value === 'admin') {
            throw new Error('customUrl cannot be user or admin');
        }
        return true;
    }),
    (0, express_validator_1.body)('originalUrl')
        .trim()
        .isURL()
        .withMessage('Original URL Should be A valid URL'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requestErrors = (0, express_validator_1.validationResult)(req);
        if (!requestErrors.isEmpty()) {
            const result = requestErrors
                .array()
                .map((obj) => `${obj.msg}`)
                .join(', ');
            const error = new Error(result);
            error.status = 400;
            throw error;
        }
        const user = yield user_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            const error = new Error('User not found, register again or sign in properly');
            error.status = 400;
            throw error;
        }
        const { originalUrl, customUrl } = req.body;
        //create a shortUrl
        let shortUrl = '';
        if (customUrl) {
            //check if the customUrl is already in use
            const urlExists = yield shorten_1.URL.findOne({ customUrl });
            if (urlExists) {
                const error = new Error('customUrl already exists');
                error.status = 400;
                throw error;
            }
            shortUrl = customUrl;
        }
        else {
            shortUrl = Math.random().toString(36).substring(7);
        }
        //save the data to the database
        const newUrl = new shorten_1.URL({
            originalUrl,
            shortUrl: shortUrl,
            urlLink: `${(0, config_1.getConfig)().baseUrl}/api/shorten/${shortUrl}`,
            creator: user.id,
        });
        yield newUrl.save();
        //send the response
        return res.status(201).json({
            message: 'URL shortened successfully',
            data: newUrl,
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
