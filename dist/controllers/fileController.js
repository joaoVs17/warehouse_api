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
exports.FileController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const File_1 = require("../models/File");
const Folder_1 = require("../models/Folder");
const User_1 = require("../models/User");
const FileController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { parent, owner_id, folder_id } = req.body;
            const { originalname: name, size, mimetype, filename, path } = req.file;
            const ownerID = yield User_1.User.findById(owner_id);
            const folderID = yield Folder_1.Folder.findById(folder_id);
            const file = {
                name,
                key: filename,
                owner: ownerID === null || ownerID === void 0 ? void 0 : ownerID._id,
                folder: folderID === null || folderID === void 0 ? void 0 : folderID._id,
                url: path,
                metadata: {
                    parent,
                    size,
                    mimetype,
                }
            };
            const response = yield File_1.File.create(file);
            res.status(201).json({ response, msg: "File created sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield File_1.File.find();
            res.json({ response });
        }
        catch (err) {
            console.log(err);
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const id = req.params.id;
            const owner_id = new mongoose_1.default.Types.ObjectId;
            owner_id._id = req.body.owner_id;
            const file = yield File_1.File.findById(id);
            if (!file) {
                res.status(404).json({ msg: "File not found" });
            }
            if (file) {
                if (((_a = file.owner) === null || _a === void 0 ? void 0 : _a._id) != owner_id) {
                    res.status(404).json({ msg: "Can't delete file" });
                }
            }
            const response = File_1.File.findByIdAndDelete(id);
            res.status(200).json({ response, msg: "File deleted sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    })
};
exports.FileController = FileController;
