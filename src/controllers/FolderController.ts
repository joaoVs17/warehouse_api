import { Folder, Folder as FolderModel } from "../models/Folder";
import { File as FileModel } from "../models/File";
import { User as UserModel } from "../models/User";
import { Request, Response } from "express";
import mongoose from "mongoose";
import path, { normalize } from "path";
import { FileInterface } from "../interfaces/file.interface";
import { FolderInterface } from "../interfaces/folder.interface";
import { FileController } from "./FileController";
import { promisify } from "util";
import fs from 'fs';

const FolderController = {

    create: async(req: Request, res: Response) => {

        try {
            const { name, parent, owner_id } = req.body


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
    getStarredFoldersFromUser: async(req: Request, res: Response) => {

        try {
            const {user_id} = req.params;
            
            if(!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
            }

            const starredFolders = await FolderModel.find({'metadata.starred': true, 'metadata.trashed': false});
            res.json({response: starredFolders, msg: ''});
        } catch (err: any) {
            console.log(err);
        }

    },
    getTrashedFoldersFromUser: async(req: Request, res: Response) => {
        try {

            const {user_id} = req.params;

            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }

            const trashedFolders = await FolderModel.find({owner: user_id, 'metadata.trashed': true});
            res.json({response: trashedFolders, msg: ''});

        } catch(err: any) {
            console.log(err);
        }

    },

    getUserFolders: async(req: Request, res: Response) => {

        try {

            const { user_id, parent_id } = req.params;


            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }

            const user = await UserModel.findOne({_id: user_id});

            if (!user) {
                res.status(422).json({response: {}, msg: "User not found"});
                return;
            }

            if (!parent_id) {
                res.status(422).json({response: {}, msg: "Parent ID is required"});
                return;
            }

            const folder = await FolderModel.findOne({_id: parent_id});

            if (!folder) {
                res.status(404).json({response: {}, msg: "Folder not found"});
                return;
            }

            const userFolders = await FolderModel.find({owner: user_id, "metadata.parent": parent_id, "metadata.trashed": false});

            res.status(200).json({response: userFolders, msg: ""});
            return;

        } catch(err: any) {
            console.log(err);
        } 

    },

    getFolderParents: async(req: Request, res: Response) => {

        const { folder_id } = req.params;

        if (!folder_id) {
            res.status(422).json({response: {}, msg: "Folder ID is required"});
            return;
        }

        const folder = await FolderModel.findOne({_id: folder_id});

        if (!folder) {
            res.status(404).json({response: {}, msg: "Folder not found"});
            return;
        }

        const parentsList: {name: string, id: string, parent_id: string}[] = [];

        if (folder.metadata?.parent) {
            parentsList.unshift({name: folder?.name, id: folder?._id.toString(), parent_id: folder?.metadata?.parent.toString() || ''});
            while(true) {
                const folder = await FolderModel.findOne({_id: parentsList[0].parent_id})
                if (!folder) {
                    break;
                }
                parentsList.unshift({name: folder?.name || '', id: folder?._id.toString() || '', parent_id: folder?.metadata?.parent.toString() || ''});
                if (!folder?.metadata?.parent) {
                    break;
                }
            }
        }


        res.status(200).json({response: parentsList, msg: ""});
        return

    },

    delete: async(req: Request, res: Response) => {
        
        try {
            
            const { folder_id, user_id } = req.params;

            if (!folder_id) {
                res.status(422).json({response: {}, msg: "ID is required"});
                return;
            }

            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }

            const folder = await FolderModel.findOne({_id: folder_id, owner: user_id});

            if (!folder) {
                res.status(404).json({response: {} ,msg: "Folder not Found"});
            }


/*             await FileModel.deleteMany({owner: user_id, 'metada.parent': id});
            await FolderModel.deleteMany({owner: user_id, 'metadata.parent': id});
 */

            const response = await FolderModel.findOneAndDelete({_id: folder_id, owner: user_id});

            await FolderController.deleteContent(folder_id);

            res.status(200).json({response, msg: "Folder deleted sucessfully"});

        } catch(err) {
            console.log(err);
        }

    },
    deleteContent: async(parent: string) => {


        const files = await FileModel.find({'metadata.parent': parent});

        if (files.length>0) {
            files.map(async file => {
                if (file.key) {
                    await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', file.key));
                }
                if (file.thumbKey) {
                    await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', file.thumbKey));
                }
    
            })
            await FileModel.deleteMany({'metadata.parent': parent});
        }

        const folders = await FolderModel.find({'metadata.parent': parent});
        if (folders.length>0) {
            folders.map( folder => {
                FolderController.deleteContent(folder._id.toString());
            })
            await FolderModel.deleteMany({'metadata.parent': parent});
        }

    },

    toggleStarFolder: async(req: Request, res: Response) => {

        try {

            const {folder_id, user_id} = req.body;
            
            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }
            if (!folder_id) {
                res.status(422).json({response: {}, msg: "Folder ID is required"});
                return;
            }

            const folder = await FolderModel.findOne({_id: folder_id, owner: user_id});

            if (!folder) {
                res.status(404).json({response: {}, msg: "Folder not found"});
                return;
            }

            const updatedFolder = await FolderModel.findOneAndUpdate({_id: folder_id, owner: user_id}, {'metadata.starred': !folder.metadata?.starred});
            res.status(200).json({response: updatedFolder, msg: "Toggle star sucessfully"});
            return;
        } catch(err) {
            console.log(err);
        }

    },
    toggleTrashFolder: async(req: Request, res: Response) => {
        
        try {

            const {folder_id, user_id} = req.body;

            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }
            if (!folder_id) {
                res.status(422).json({response: {}, msg: "Folder ID is required"});
                return;
            }

            const folder = await FolderModel.findOne({_id: folder_id, owner: user_id});

            if(!folder) {
                res.status(404).json({response: {}, msg: "Folder not found"});
                return;
            }

            const updatedFolder = await FolderModel.findOneAndUpdate({_id: folder_id, owner: user_id}, {'metadata.trashed': !(folder.metadata?.trashed), 'metadata.starred': false});

            res.status(200).json({response: updatedFolder, msg: "Toggle trash sucessfully"});

        } catch(err: any) {
            console.log(err);
        }

    },

    updateFolderParent: async(req: Request, res: Response) => {
        try {

            const {folder_id, user_id, new_parent_id, current_folder_id} = req.body;

            if (!folder_id) {
                res.status(422).json({response: {}, msg: "Folder ID is required"});
                return;
            }
            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }
            if (!new_parent_id) {
                res.status(422).json({response: {}, msg: "New parent ID is required"});
                return;
            }
            if (!current_folder_id) {
                res.status(422).json({response: {}, msg: "Current folder ID is required"});
                return;
            }

            if (folder_id == new_parent_id) {
                res.status(400).json({response: {}, msg: "Folder ID and new parent ID must be different"}); 
            }

            const folder = await FolderModel.findOne({_id: folder_id, owner: user_id, 'metadata.parent': current_folder_id});

            if (!folder) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }

            const parent_folder = await FolderModel.findOne({_id: new_parent_id});

            if (!parent_folder) {
                res.status(404).json({response: {}, msg: "Folder not found"});
                return;
            }

            const updatedFolder = await FolderModel.findOneAndUpdate({_id: folder, owner: user_id, 'metadata.parent': current_folder_id}, {'metadata.parent': new_parent_id});
        
            res.status(200).json({response: updatedFolder, msg: 'File moved sucessfully'});
            return;
            
        } catch(err) {
            console.log(err);
        }
    },

    updateFolderName: async(req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const {folder_id, user_id} = req.params;

            if (!folder_id) {
                res.status(422).json({response: {}, msg: "Folder ID is required"});
                return;
            }
            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
            }

            if (!name) {
                res.status(422).json({response: {}, msg: "Name is required"});
                return;                
            }

            const folder = await FolderModel.findOne({_id: folder_id, owner: user_id});

            if (!folder) {
                res.status(404).json({response: {}, msg: "Folder not found"});
                return;
            }

            const updatedFolder = await FolderModel.findOneAndUpdate({_id: folder_id, owner: user_id}, {name: name});

            res.status(200).json({response: updatedFolder, msg: "Folder renamed sucessfully"});
            return;

        } catch(err: any) {
            console.log(err);
        } 
    }

}

export { FolderController };