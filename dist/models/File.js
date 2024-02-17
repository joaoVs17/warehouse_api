"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { userSchema } = require('User');
const { folderSchema } = require('Folder');
const { Schema } = mongoose_1.default;
const fileSchema = new Schema({
    name: { type: String, required: true },
    key: { type: String, required: true },
    folder: { type: [folderSchema], required: true },
    owner: {
        type: [userSchema],
        required: true,
    },
    metadata: {
        type: {
            mimetype: { type: String, required: true },
            parent: { type: String, required: true },
            starred: { type: Boolean, required: true },
            personalFile: { type: Boolean, required: true },
            createdAt: { type: Date, default: Date.now },
        }
    }
}, { timestamps: true });
const File = mongoose_1.default.model('File', fileSchema);
module.exports = {
    File,
};
