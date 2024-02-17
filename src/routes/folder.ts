import { Router, Request, Response } from 'express';
import { FolderController } from '../controllers/FolderController';

const router = Router();

router.route('/folders').post((req: Request, res: Response) => {FolderController.create(req, res)});
router.route('/folders').get((req: Request, res: Response) => {FolderController.getAll(req, res)});
router.route('/folders/:id').delete((req: Request, res: Response) => {FolderController.delete(req, res)});

export { router };