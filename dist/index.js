"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const cors = require('cors');
const app = (0, express_1.default)();
const route = (0, express_2.Router)();
//DB SETUP
const conn = require('./db/conn');
conn();
//middlewares
app.use(cors());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use(express_1.default.json());
//PORT
const PORT = 3000;
//routes
const routes = require('./routes/router');
app.use('/api', routes);
//app listen
app.listen(PORT, () => 'server running');
