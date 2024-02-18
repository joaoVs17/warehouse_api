import { Router, Request, Response, NextFunction } from 'express'
import { UserController } from "../controllers/UserController";

import jwt from 'jsonwebtoken';
import environment from '../environment';

const router = Router();

function checkToken(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({msg: "Token is required"});
    }

    try {
        

        const secret = environment.SECRET;

        jwt.verify(token, secret);

        next();

    } catch(err: any) {
        res.status(400).json({msg: "Token invalid"});
    }

}

router.route('/users/:id').get([checkToken], (req: Request, res: Response) => {UserController.get(req, res)});
router.route('/users').get((req: Request, res: Response) => {UserController.getAll(req, res)});
router.route('/users/:id').delete(checkToken,(req: Request, res: Response) => {UserController.delete(req, res)});

export { router, checkToken }