"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    recovery_email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
module.exports = {
    User,
    userSchema
};
