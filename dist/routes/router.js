"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersRouter = require('./users');
const multer = require('multer');
const multerConfig = require('../config/multer');
const router = (0, express_1.Router)();
router.post("/posts", multer(multerConfig).single("file"), (req, res) => {
    console.log(req.file);
    return res.json({ msg: 'ok' });
});
router.use('/', usersRouter);
module.exports = router;
