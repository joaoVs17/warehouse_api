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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
exports.router = router;
router.route('/auth/register').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    UserController_1.UserController.create(req, res);
}));
router.route('/auth/login').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    UserController_1.UserController.login(req, res);
}));
router.route('/auth/confirmEmail/:token').put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    UserController_1.UserController.confirmEmail(req, res);
}));
