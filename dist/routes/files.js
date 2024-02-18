"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const users_1 = require("./users");
const multer_1 = require("../config/multer");
const FileController_1 = require("../controllers/FileController");
const multer = require('multer');
const router = (0, express_1.Router)();
exports.router = router;
router.route('/files').post([users_1.checkToken, multer(multer_1.multerConfig).single('file')], (req, res) => {
    FileController_1.FileController.create(req, res);
});
