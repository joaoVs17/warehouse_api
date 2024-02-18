import { Router, Request, Response } from "express";
import { checkToken } from "./users";
import { multerConfig } from "../config/multer";
import { FileController } from "../controllers/FileController";

const multer = require('multer');
const router = Router();

router.route('/files').post([checkToken, multer(multerConfig).single('file')], (req: Request, res: Response) => {
    FileController.create(req, res);
})

export { router }

