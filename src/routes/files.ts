import { Router, Request, Response } from "express";
import { checkToken } from "./users";
import { multerConfig } from "../config/multer";
import { FileController } from "../controllers/FileController";

const multer = require('multer');
const router = Router();


/* router.route('/files').get([checkToken], (req: Request, res: Response) => {
    FileController.getAll(req, res);
}) */

//Download File
router.route('/files/:id/download').get((req: Request, res: Response) => {
    FileController.download(req, res);
})
//get file data
router.route('/files/:file_id/user/:user_id').get((req: Request, res: Response) => {
    FileController.getFile(req, res);
})

//Rename File
router.route('/files/:file_id/user/:user_id').patch((req: Request, res: Response) => {FileController.renameFile(req, res)});

//getFiles from specific user and folder
router.route('/files/user/:user_id/parent/:parent_id').get(/* [checkToken], */ (req: Request, res: Response) => {
    FileController.getUserFiles(req, res);
})

//send file
router.route('/files').post([/* checkToken, */ multer(multerConfig).array('files')], (req: Request, res: Response) => {
    FileController.create(req, res);
})

//delete file
router.route('/files/:file_id/user/:user_id').delete(/* [checkToken], */ (req: Request, res: Response) => {
    FileController.delete(req, res);
})

//toggle star file 
router.route('/files/star/').patch((req: Request, res: Response) => {
    FileController.toggleStarFile(req, res);
})
//toggle trash file
router.route('/files/trash').patch((req: Request, res: Response) => {
    FileController.toggleTrashFile(req, res);
})
//get starred files from user
router.route('/files/star/user/:user_id').get((req: Request, res: Response) => {FileController.getStarredFilesFromUser(req, res)});
//get trashed files from user
router.route('/files/trash/user/:user_id').get((req: Request, res: Response) => {FileController.getTrashedFilesFromUser(req, res)});
//move file from folder
router.route('/files/move').patch((req: Request, res: Response) => {FileController.updateFileParent(req, res)});
//share file
router.route('/files/:file_id/share').patch((req: Request, res:Response) => {FileController.share(req, res)});
//get shared users
router.route('/files/:file_id/share').get((req: Request, res: Response) => {FileController.getSharedUsers(req, res)});
//

export { router }

