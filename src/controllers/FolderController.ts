import { Folder as FolderModel } from "../models/Folder";
import { Request, Response } from "express";
import mongoose from "mongoose";

const FolderController = {

    create: async(req: Request, res: Response) => {

        try {
            const { name, parent } = req.body

            const owner_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId; 

            owner_id._id = req.body.owner_id;

            const folder = {
                name,
                owner: owner_id,
                metadata: {
                    parent,
                }

            }
    
            const response = await FolderModel.create(folder);
    
            res.status(201).json({response, msg: "Folder create sucessfully"})
        } catch (err: any) {
            console.log(err);
        }

    },

    getAll: async(req: Request, res: Response) => {

        try {
            const response = await FolderModel.find();
            res.json({response, msg: ''});
        } catch (err: any) {
            console.log(err);
        }

    },

    delete: async(req: Request, res: Response) => {
        
        try {
            
            const id = req.params.id;

            const folder = await FolderModel.findById(id);

            if (!folder) {
                res.status(404).json({response: {} ,msg: "Folder not Found"});
            }

            const response = await FolderModel.findByIdAndDelete(id);

            res.status(200).json({response, msg: "Folder deleted sucessfully"});

        } catch(err) {
            console.log(err);
        }

    }

}

export { FolderController };