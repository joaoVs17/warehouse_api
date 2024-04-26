import { Router, Request, Response } from 'express';
import { FolderController } from '../controllers/FolderController';

const router = Router();

router.route('/folders').post((req: Request, res: Response) => {FolderController.create(req, res)});
router.route('/folders').get((req: Request, res: Response) => {FolderController.getAll(req, res)});
router.route('/folders/:id').delete((req: Request, res: Response) => {FolderController.delete(req, res)});
router.route('/folders/user/:user_id/parent/:parent_id').get((req: Request, res: Response)=> {FolderController.getUserFolders(req, res)}); 
router.route('/folders/parents/:folder_id').get((req: Request, res: Response) => {FolderController.getFolderParents(req, res)});
router.route('/folders/:folder_id/user/:user_id').patch((req: Request, res: Response) => {FolderController.updateFolderName(req, res)});
router.route('/folders/star').patch((req: Request, res: Response) => {FolderController.toggleStarFolder(req, res)});
router.route('/folders/trash').patch((req: Request, res: Response) => {FolderController.toggleTrashFolder(req, res)});
router.route('/folders/:folder_id/user/:user_id').delete((req: Request, res: Response) => {FolderController.delete(req, res)});
router.route('/folders/star/user/:user_id').get((req: Request, res: Response) => {FolderController.getStarredFoldersFromUser(req, res)});
router.route('/folders/trash/user/:user_id').get((req: Request, res: Response) => {FolderController.getTrashedFoldersFromUser(req, res)});
router.route('/folders/move').patch((req: Request, res: Response) => {FolderController.updateFolderParent(req, res)});

export { router };