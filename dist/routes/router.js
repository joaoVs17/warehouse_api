"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const users_1 = require("./users");
const folder_1 = require("./folder");
const auth_1 = require("./auth");
const files_1 = require("./files");
const multer_2 = require("../config/multer");
const router = (0, express_1.Router)();
exports.router = router;
router.post("/posts", (0, multer_1.default)(multer_2.multerConfig).single("file"), (req, res) => {
    console.log(req.file);
    return res.json({ msg: 'ok' });
});
router.use('/', users_1.router);
router.use('/', folder_1.router);
router.use('/', auth_1.router);
router.use('/', files_1.router);
