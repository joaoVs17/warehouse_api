import mongoose, {Schema} from "mongoose";

import { Request, Response } from "express";
import { File as FileModel } from "../models/File";
import { Folder as FolderModel } from "../models/Folder"
import { User, User as UserModel } from "../models/User";
import fs from 'fs';
import path from "path";
import { promisify } from "util";

const FileController = {

    create: async(req: Request, res: Response) => {

        try {
             
            const { owner_id, folder_id } = req.body;

            const owner = await UserModel.findById(owner_id);

            if (!owner) {
                res.status(404).json({response: {}, msg: "User not found"});
                return;
            }

            const folder = await FolderModel.findById(folder_id);
            if (!folder) {
                res.status(404).json({response: {}, msg: "Folder not found"});
                return;
            }

            //verifying if it's an image
            if (req.files?.length == 2) {

                const reqFiles: Express.Multer.File[] = req.files as Express.Multer.File[];
                
                const file = {
                    name: reqFiles[0].originalname,
                    key: reqFiles[0].filename,
                    thumbKey: reqFiles[1].filename,
                    owner: owner_id,
                    folder: folder_id,
                    metadata: {
                        parent: folder_id,
                        size: reqFiles[0].size,
                        mimetype: reqFiles[0].mimetype
                    }
                }

                const response = await FileModel.create(file);
                res.status(201).json({response, msg: "File created Sucessfully"});

            } else {

                const reqFiles: Express.Multer.File[] = req.files as Express.Multer.File[];
                const { originalname: name, size, mimetype, filename} = reqFiles[0];
                const file = {
                    name,
                    key: filename,
                    owner: owner_id,
                    folder: folder_id,
                    metadata: {
                        parent: folder_id,
                        size,
                        mimetype,
                    } 
                }
                const response = await FileModel.create(file);
                res.status(201).json({response, msg: "File created sucessfully"});   
            }





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

    getStarredFilesFromUser: async(req: Request, res: Response) => {

        try {
            const {user_id} = req.params;
            
            if(!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
            }

            const starredFiles = await FileModel.find({owner:user_id,'metadata.starred': true, 'metadata.trashed': false});
            res.json({response: starredFiles, msg: ''});
        } catch (err: any) {
            console.log(err);
        }

    },
    getTrashedFilesFromUser: async(req: Request, res: Response) => {
        try {

            const {user_id} = req.params;

            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }

            const trashedFiles = await FileModel.find({owner: user_id,'metadata.trashed': true});
            res.json({response: trashedFiles, msg: ''});

        } catch(err: any) {
            console.log(err);
        }

    },

    get: async(req: Request, res: Response) => {
        try {

            const id = req.params.id;

            if (!id) {
                res.status(422).json({response: {} ,msg: "ID is required"});
            }
            
            const response = await FileModel.findOne({_id: id});

            res.status(200).json({response, msg: ''});

        } catch (err: any) {
            console.log(err)
        }
    },

    download: async(req: Request, res: Response) => {
        try {
            const id = req.params.id;

            if (!id) {
                res.status(422).json({response: {}, msg: "ID is required"});
                return;
            }

            const file = await FileModel.findOne({_id: id});

            if (!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }
            res.download(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', file.key));
        } catch (err) {
            console.log(err);
        }
    },

    retrieveImage: async(req: Request, res: Response) => {
        try {

            const file_id = req.params.id;

            if (!file_id) {
                res.status(422).json({response: {}, msg: "File Id is required"});
                return;
            }   
        } catch(err: any) {
            console.log(err);
        }
    },

    getUserFiles: async(req: Request, res: Response) => {

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
                res.status(422).json({response: {}, msg: "Folder not found"});
                return;
            }

            const userFiles = await FileModel.find({owner: user_id, "metadata.parent": parent_id, 'metadata.trashed': false});


            res.status(200).json({response: userFiles, msg: ""});
            return;

        } catch(err: any) {
            console.log(err);
        } 

    },

    delete: async(req: Request, res: Response) => {

        try {
            const {file_id, user_id} = req.params;

            const file = await FileModel.findById(file_id);

            if(!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }

            if (file) {
                const ownerIdString: string = file.owner.toString();
                if (ownerIdString != user_id ){
                    res.status(404).json({response: {}, msg: "Can't delete file"})
                    return;
                }
            }

            const key = file?.key;
            const thumbKey = file?.thumbKey;

            if (key){
                await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key));
            }
            if (thumbKey) {
                await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', thumbKey));
            }

            const response = await FileModel.findOneAndDelete({_id: file_id});

            res.status(200).json({response, msg: "File deleted sucessfully"});
            return;
        } catch(err: any) {
            console.log(err);
        }

    },

    toggleStarFile: async(req: Request, res: Response) => {

        try {

            const {user_id, file_id} = req.body;

            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }
            if (!file_id) {
                res.status(422).json({response: {}, msg: "File ID is required"});
                return;
            }

            const file = await FileModel.findOne({_id: file_id, owner: user_id});

            if (!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }

            const updatedFile = await FileModel.findOneAndUpdate({_id: file_id, owner: user_id}, {'metadata.starred': !file.metadata.starred});
            res.status(200).json({response: updatedFile, msg: "Toggle star sucessfully"});
            return;
        } catch (err: any) {
            console.log(err);
        }
    },
    toggleTrashFile: async(req: Request, res: Response) => {
        try {

            const {file_id, user_id} = req.body;

            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }
            if (!file_id) {
                res.status(422).json({response: {}, msg: "File ID is required"});
                return;
            }

            const file = await FileModel.findOne({_id: file_id, owner: user_id});

            if(!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }

            const updatedFile = await FileModel.findOneAndUpdate({_id: file_id, owner: user_id}, {'metadata.trashed': !(file.metadata?.trashed), 'metadata.starred': false});
            res.status(200).json({response: updatedFile, msg: "Toggle trash sucessfully"});

        } catch(err: any) {
            console.log(err);
        }

    },

    renameFile: async(req: Request, res: Response) => {

        try {

            const {user_id, file_id} = req.params;
            const { name } = req.body;

            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }
            if (!file_id) {
                res.status(422).json({response: {}, msg: "File ID is required"});
                return;
            }
            if (!name) {
                res.status(422).json({response: {}, msg: "Name is required"});
                return;
            }

            const file = await FileModel.findOne({_id: file_id, owner: user_id});

            if (!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }

            const newName = file.name.replace(file.name.substring(0, file.name.lastIndexOf('.')), name);
            const newKey = file.key.replace(file.name, newName);

            const oldPath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads', file.key); 
            const newPath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads', newKey)   


            fs.rename(oldPath, newPath, (err) => {
                if (err) throw err;
                console.log('File renamed sucessfully');
            });

            const renamedFile = await FileModel.findOneAndUpdate({_id: file_id, owner: user_id}, {name: newName, key: newKey});

            res.status(200).json({response: renamedFile, msg: "File renamed sucessfully"});
            return;

        } catch(err: any) {
            console.log(err);
        }

    },

    updateFileParent: async(req: Request, res: Response) => {
        try {

            const {file_id, user_id, new_parent_id, current_folder_id} = req.body;

            if (!file_id) {
                res.status(422).json({response: {}, msg: "File ID is required"});
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

            const file = await FileModel.findOne({_id: file_id, owner: user_id, 'metadata.parent': current_folder_id});

            if (!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }

            const folder = await FolderModel.findOne({_id: new_parent_id});

            if (!folder) {
                res.status(404).json({response: {}, msg: "Folder not found"});
                return;
            }

            const updatedFile = await FileModel.findOneAndUpdate({_id: file_id, owner: user_id, 'metadata.parent': current_folder_id}, {'metadata.parent': new_parent_id});

            res.status(200).json({response: updatedFile, msg: 'File moved sucessfully'});
            return;

        } catch(err) {
            console.log(err);
        }
    },

    share: async(req: Request, res: Response) => {

        try {

            const {user_email, owner_id} = req.body;
            const {file_id} = req.params

            const user = await UserModel.findOne({email: user_email});
            if (!user) {
                res.status(404).json({response: {}, msg: "User not found"});
                return;
            }

            const owner = await UserModel.findOne({_id: owner_id});
            if (!owner) {
                res.status(404).json({response: {}, msg: "Owner not found"});
                return;
            }

            if(user?._id.toString() === owner_id) {
                res.status(422).json({reponse: {}, msg: "Cannot share with the owner"});
                return;
            }

            const file = await FileModel.findOne({_id: file_id, owner: owner_id});

            if (!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }
            
            const fileShared = await FileModel.findOne({_id: file_id, owner: owner_id, "sharedWith.user": user._id.toString()});
            if (fileShared) {
                res.status(409).json({respones: {}, msg: "User already have acess"});
                return;
            }

            const shared_file_data = {
                archive: file_id || '',
                owner: user?._id.toString() || '',
            }

            const user_shared_data = {
                user: user?._id.toString() || '',
            }

            const updatedUser = await UserModel.findOneAndUpdate({email: user_email},{$push: {filesSharedWithMe: shared_file_data}});
            const updatedFile = await FileModel.findOneAndUpdate({_id: file_id, owner: owner_id}, {$push: {sharedWith: user_shared_data}});
            
            res.status(200).json({response: {user: updatedUser, archive: updatedFile}, msg: "File Shared Sucessfully"});

        } catch(err) {
            console.log(err);
        }
    }, 

    getFile: async(req: Request, res: Response) => {
        try {
            
            const {file_id, user_id} = req.params;

            if (!file_id) {
                res.status(422).json({response: {}, msg: "File ID is required"});
                return;
            }
            if (!user_id) {
                res.status(422).json({response: {}, msg: "User ID is required"});
                return;
            }

            const user = await UserModel.findOne({_id: user_id});
            if (!user) {
                res.status(404).json({response: {}, msg: "User not found"});
                return;
            }
            
            const file = await FileModel.findOne({_id: file_id, owner: user_id});

            if (!file) {
                res.status(404).json({response: {}, msg: "File not found"});
                return;
            }

            res.status(200).json({reponse: file, msg: "File found sucessfully"});

        } catch(err: any) {
            console.log(err);
        }

    },

    getSharedUsers: async(req: Request, res: Response) => {

        try {
            const {file_id} = req.params;

            if (!file_id) {
                res.status(422).json({response: {}, msg: "File ID is required"});
                return;
            }

            const file = await FileModel.findOne({_id: file_id});

            if (!file) {
                res.status(422).json({response: {}, msg: "File not found"});
                return;
            }

            const users = await UserModel.find({"filesSharedWithMe.archive": file_id});

            res.status(200).json({response: users, msg: ""});

        } catch(err: any) {
            console.log(err);
        }

    }

} 

export { FileController }