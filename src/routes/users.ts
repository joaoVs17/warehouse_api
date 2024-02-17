import { Router } from 'express'
import { UserController } from "../controllers/UserController";

const router = Router();

router.route('/users').post((req: any, res: any) => {UserController.create(req, res)});
router.route('/users').get((req: any, res: any) => {UserController.getAll(req, res)});
router.route('/users/:id').delete((req: any, res: any) => {UserController.delete(req, res)});

export { router }