import { Router, Request, Response } from "express";
import { UserController } from '../controllers/UserController'

const router = Router();

router.route('/auth/register').post(async (req: Request, res: Response) => {
    UserController.create(req, res);
})
router.route('/auth/login').post(async(req: Request, res: Response) => {
    UserController.login(req, res);
})
router.route('/auth/confirmEmail/:token').put(async(req: Request, res: Response) => {
    UserController.confirmEmail(req, res);
})

export { router };