import mongoose, {Schema} from "mongoose";

import { Request, Response } from "express";
import { File as FileModel } from "../models/File";
import { Folder as FolderModel } from "../models/Folder"
import { User as UserModel } from "../models/User";
import fs from 'fs';
import path from "path";
import { promisify } from "util";

const FileController = {

    create: async(req: Request, res: Response) => {

        try {
            
            const { parent, owner_id, folder_id } = req.body;

            const { originalname: name, size, mimetype, filename} = req.file as Express.Multer.File;

            const ownerID = await UserModel.findById(owner_id);
            const folderID = await FolderModel.findById(folder_id);

            const url = `http://localhost:3000/api/files/${filename}`;

            const file = {
                name,
                key: filename,
                owner: ownerID?._id,
                folder: folderID?._id,
                url,
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
            res.json({response, msg: ''});
        } catch (err: any) {
            console.log(err);
        }

    },

    get: async(req: Request, res: Response) => {
        try {

            const id = req.params.id;

            if (!id) {
                res.status(422).json({response: {} ,msg: "Id is required"});
            }
            
            const response = await FileModel.findOne({_id: id});

            res.status(200).json({response, msg: ''});

        } catch (err: any) {
            console.log(err)
        }
    },

    delete: async(req: Request, res: Response) => {

        try {
            
            const id = req.params.id;
            const owner_id = req.body.owner_id;

            const file = await FileModel.findById(id);

            if(!file) {
                res.status(404).json({response: {}, msg: "File not found"});
            }

            if (file) {

                const ownerIdString: string = file.owner.toString();
                if (ownerIdString != owner_id ){
                    res.status(404).json({response: {}, msg: "Can't delete file"})
                }
            }

            const key = file?.key;

            await FileModel.findOneAndDelete({_id: id});

            if (key){
                await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key));
            }

            res.status(200).json({response: {}, msg: "File deleted sucessfully"});

        } catch(err: any) {
            console.log(err);
        }

    }

} 

export { FileController }