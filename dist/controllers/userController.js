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
const { User: UserModel } = require("../models/User");
const userController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { first_name, last_name, email, recovery_email, phone, password } = req.body;
        try {
            const user = {
                first_name,
                last_name,
                email,
                recovery_email,
                phone,
                password
            };
            const response = yield UserModel.create(user);
            res.status(201).json({ response, msg: "User Created Successfully" });
        }
        catch (err) {
            console.log(err);
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield UserModel.find();
            res.status(201).json({ response });
        }
        catch (err) {
            console.log(err);
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = yield UserModel.findById(id);
            if (!user) {
                res.status(404).json({ msg: "User not found" });
                return;
            }
            const response = yield UserModel.findByIdAndDelete(id);
            res.status(200).json({ response, msg: "User deleted sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    })
};
