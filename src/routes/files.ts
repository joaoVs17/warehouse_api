import { Router, Request, Response } from "express";
import { checkToken } from "./users";
import { multerConfig } from "../config/multer";
import { FileController } from "../controllers/FileController";

const multer = require('multer');
const router = Router();


router.route('/files').get([checkToken], (req: Request, res: Response) => {
    FileController.getAll(req, res);
})
router.route('/files/:id').get([checkToken], (req: Request, res: Response) => {
    FileController.get(req, res);
})
router.route('/files').post([checkToken, multer(multerConfig).single('file')], (req: Request, res: Response) => {
    FileController.create(req, res);
})
router.route('/files/:id').delete([checkToken], (req: Request, res: Response) => {
    FileController.delete(req, res);
})

export { router }

