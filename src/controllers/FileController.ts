import mongoose from "mongoose";

import { Request, Response } from "express";
import { File as FileModel } from "../models/File";

const FileController = {

    create: async(req: Request, res: Response) => {

        try {
            
            const { parent } = req.body;

            const { originalname: name, size, mimetype, filename, path} = req.file as Express.Multer.File;

            const owner_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId;

            owner_id._id = req.body.owner_id;

            const file = {
                name,
                key: filename,
                owner: owner_id,
                url: path,
                metadata: {
                    parent,
                    size,
                    mimetype,
                }

            }

            const response = await FileModel.create(file);

            res.status(201).json({response, msg: "File created sucessfully"});

        } catch (err: any) {
            console.log(err);
        }

    },

    getAll: async(req: Request, res: Response) => {

        try {
            const response = await FileModel.find();
            res.json({response});
        } catch (err: any) {
            console.log(err);
        }

    },

    delete: async(req: Request, res: Response) => {

        try {
            
            const id = req.params.id;
            const owner_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId;
            owner_id._id = req.body.owner_id;

            const file = await FileModel.findById(id);

            if(!file) {
                res.status(404).json({msg: "File not found"});
            }

            if (file) {
                if (file.owner?._id != owner_id ){
                    res.status(404).json({msg: "Can't delete file"})
                }
            }

            const response = FileModel.findByIdAndDelete(id);

            res.status(200).json({response, msg: "File deleted sucessfully"});

        } catch(err: any) {
            console.log(err);
        }

    }

} 

export { FileController }