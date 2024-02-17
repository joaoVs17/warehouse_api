"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userController = require("../controllers/userController");
router.route('/users').post((req, res) => { userController.create(req, res); });
router.route('/users').get((req, res) => { userController.getAll(req, res); });
router.route('/users/:id').delete((req, res) => { userController.delete(req, res); });
module.exports = router;
