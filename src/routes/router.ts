import multer from "multer";

import {Router} from "express";
import { router as usersRouter } from "./users";
import {multerConfig} from "../config/multer";

const router = Router();

router.post("/posts", multer(multerConfig).single("file"), (req: any, res: any)=>{
    console.log(req.file);

    return res.json({msg: 'ok'});

})

router.use('/', usersRouter);

export { router };