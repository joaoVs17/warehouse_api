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
exports.FolderController = void 0;
const Folder_1 = require("../models/Folder");
const mongoose_1 = __importDefault(require("mongoose"));
const FolderController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, parent } = req.body;
            const owner_id = new mongoose_1.default.Types.ObjectId;
            owner_id._id = req.body.owner_id;
            const folder = {
                name,
                owner: owner_id,
                metadata: {
                    parent,
                }
            };
            const response = yield Folder_1.Folder.create(folder);
            res.status(201).json({ response, msg: "Folder create sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield Folder_1.Folder.find();
            res.json({ response });
        }
        catch (err) {
            console.log(err);
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const folder = yield Folder_1.Folder.findById(id);
            if (!folder) {
                res.status(404).json({ msg: "Folder not Found" });
            }
            const response = yield Folder_1.Folder.findByIdAndDelete(id);
            res.status(200).json({ response, msg: "Folder deleted sucessfully" });
        }
        catch (err) {
            console.log(err);
        }
    })
};
exports.FolderController = FolderController;
