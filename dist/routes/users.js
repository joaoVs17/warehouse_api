"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.router = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
exports.router = router;
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Token is required" });
    }
    try {
        if (process.env.SECRET) {
            const secret = process.env.SECRET;
            jsonwebtoken_1.default.verify(token, secret);
            next();
        }
    }
    catch (err) {
        res.status(400).json({ msg: "Token invalid" });
    }
}
exports.checkToken = checkToken;
router.route('/users/:id').get([checkToken], (req, res) => { UserController_1.UserController.get(req, res); });
router.route('/users').get((req, res) => { UserController_1.UserController.getAll(req, res); });
router.route('/users/:id').delete(checkToken, (req, res) => { UserController_1.UserController.delete(req, res); });
