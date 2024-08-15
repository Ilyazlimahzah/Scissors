"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL = void 0;
const mongoose_1 = require("mongoose");
const urlSchema = new mongoose_1.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    visitCount: {
        type: Number,
        default: 0,
    },
    urlLink: {
        type: String,
        required: true,
    },
    location: [
        {
            type: String,
            required: true,
        },
    ],
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.creator.password;
            delete ret.creator.__v;
        },
    },
});
const URL = (0, mongoose_1.model)('URL', urlSchema);
exports.URL = URL;
