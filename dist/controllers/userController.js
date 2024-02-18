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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const Folder_1 = require("../models/Folder");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const environment_1 = __importDefault(require("../environment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { first_name, last_name, email, recovery_email, phone, password, confirmPassword } = req.body;
        try {
            //Validate
            if (!first_name) {
                return res.status(422).json({ msg: "First name is required" });
            }
            if (!last_name) {
                return res.status(422).json({ msg: "Last name is required" });
            }
            if (!email) {
                return res.status(422).json({ msg: "Email is required" });
            }
            if (!password) {
                return res.status(422).json({ msg: "Password is required" });
            }
            if (!confirmPassword) {
                return res.status(422).json({ msg: "Confirm password is required" });
            }
            if (password !== confirmPassword) {
                return res.status(422).json({ msg: "Passwords don't match" });
            }
            const userExists = yield User_1.User.findOne({ email: email });
            if (userExists) {
                res.status(422).json({ msg: "This email already exists" });
            }
            const salt = yield bcrypt_1.default.genSalt(12);
            const passwordHash = yield bcrypt_1.default.hash(password, salt);
            const user = {
                first_name,
                last_name,
                email,
                recovery_email,
                phone,
                password: passwordHash,
                confirmEmailToken: crypto_1.default.randomBytes(16).toString('hex'),
            };
            const response = yield User_1.User.create(user);
            res.status(201).json({ response, msg: "User Created Successfully" });
        }
        catch (err) {
            console.log(err);
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            if (!email) {
                res.status(422).json({ msg: "Email is required" });
            }
            const user = yield User_1.User.findOne({ email: email });
            if (!user) {
                res.status(404).json({ msg: "User not found" });
            }
            if (!password) {
                res.status(422).json({ msg: "Password is required" });
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || '');
            if (!passwordMatch) {
                res.status(422).json({ msg: "Wrong Password or Email" });
            }
            const secret = environment_1.default.SECRET;
            const token = jsonwebtoken_1.default.sign({
                id: user._id
            }, secret);
            res.status(200).json({ token, msg: "User logged in sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    }),
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = yield User_1.User.findById(id, '-password');
            if (!user) {
                res.status(404).json({ msg: "User not found" });
            }
            res.status(200).json({ user });
        }
        catch (err) {
            console.log(err);
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield User_1.User.find();
            res.json({ response });
        }
        catch (err) {
            console.log(err);
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = yield User_1.User.findById(id);
            if (!user) {
                res.status(404).json({ msg: "User not found" });
                return;
            }
            const response = yield User_1.User.findByIdAndDelete(id);
            res.status(200).json({ response, msg: "User deleted sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    }),
    confirmEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const confirmEmailToken = req.params.token;
            if (!confirmEmailToken) {
                res.status(422).json({ msg: 'Token is required' });
            }
            const user = yield User_1.User.findOne({ confirmEmailToken: confirmEmailToken });
            if (!user) {
                res.status(422).json({ msg: 'User not found' });
            }
            const response = yield User_1.User.findOneAndUpdate({ confirmEmailToken: confirmEmailToken }, { confirmEmailToken: null });
            const folder = {
                name: 'Root',
                owner: response === null || response === void 0 ? void 0 : response._id,
            };
            const responseFolder = yield Folder_1.Folder.create(folder);
            res.status(200).json({ response, msg: "Email confirmed sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    })
};
exports.UserController = UserController;
