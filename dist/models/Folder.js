"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = require('User');
const folderSchema = new Schema({
    name: { type: String, required: true },
    files: { type: Array },
    folders: { type: Array },
    owner: {
        type: [userSchema],
        required: true,
    },
    metadata: {
        type: {
            isPersonal: { type: Boolean, required: true },
            parent: { type: String, required: true },
            starred: { type: Boolean, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    },
}, {
    timestamps: true,
});
const Folder = mongoose_1.default.model('Folder', folderSchema);
module.exports = {
    Folder,
};
