import { Request, Response } from "express";
import { User as UserModel, userSchema } from "../models/User";
import { Folder as FolderModel } from "../models/Folder";
import crypto from 'crypto';
import bcrypt from "bcrypt";
import environment from "../environment";
import jwt from 'jsonwebtoken';

const UserController = {

    create: async (req: Request, res: Response) => {
        
        const { first_name, last_name, email, recovery_email, password, confirm_password} = req.body;

        try {
            //Validate
            if (!first_name) {
                res.status(422).json({response: {}, msg: "First name is required"});
                return;
            }
            if (!last_name) {
                res.status(422).json({response: {}, msg: "Last name is required"});
                return;
            }
            if (!email) {
                res.status(422).json({response: {}, msg: "Email is required"});
                return;
            }
            if (!password) {
                res.status(422).json({response: {}, msg: "Password is required"});
                return;
            }
            if (!confirm_password) {
                res.status(422).json({response: {}, msg: "Confirm password is required"});
                return;
            }

            if (password !== confirm_password) {
                res.status(422).json({response: {}, msg: "Passwords don't match"});
                return;
            }

            const userExists = await UserModel.findOne({email: email});

            if (userExists) {
                res.status(422).json({response: {}, msg: "This email already exists"});
                return;
            }
    
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            const user = {
                first_name,
                last_name,
                email,
                recovery_email,
                password: passwordHash,
                confirmEmailToken: crypto.randomBytes(16).toString('hex'),
            }
            
            const response = await UserModel.create(user);

            return res.status(201).json({response, msg: "User Created Successfully"});

        } catch (err) {
            console.log(err);
        }
    },

    login: async(req: Request, res: Response) => {

        const { email, password } = req.body;
        
        try {

            if (!email) {
                res.status(422).json({response: {}, msg: "Email is required"})
            }

            const user = await UserModel.findOne({email: email});
            
            if (!user) {
                res.status(404).json({response: {}, msg: "User not found"});
            }

            if (user?.confirmEmailToken) {
                res.status(422).json({response: {}, msg: "Email not confirmed"});
            }

            if (!password) {
                res.status(422).json({response: {}, msg: "Password is required"})
            }

            const passwordMatch = await bcrypt.compare(password, user?.password || '') ;

            if (!passwordMatch) {
                res.status(422).json({response: {}, msg: "Wrong Password or Email"})
            }

            const secret = environment.SECRET;
            const token = jwt.sign ({
                id: user!._id
            }, secret!)

            res.status(200).json({response: {
                token, 
                userId: user?._id, 
                first_name: user?.first_name, 
                last_name: user?.last_name, 
                email: user?.email, 
                root_folder: user?.root_folder, 
                recovery_email: user?.recovery_email
            }, msg: "User logged in sucessfully"});


        } catch (err: any) {
            console.log(err);
        }

    },
 
    get: async(req: Request, res: Response) => {
    
        try {
            const id = req.params.id;

            const user = await UserModel.findById(id, '-password');

            if (!user) {
                res.status(404).json({response: {}, msg: "User not found"});
            }

            res.status(200).json({user});

        } catch (err:any) {
            console.log(err);
        }

    },

    getAll: async (req: Request, res: Response) => {
        
        try {
            const response = await UserModel.find();
            res.json({response, msg: '' })
        } catch(err) {
            console.log(err);
        }

    },

    delete: async (req: any, res: any) => {
        
        try {
            
            const id = req.params.id;
            const user = await UserModel.findById(id);

            if(!user) {
                res.status(404).json({response: {}, msg: "User not found"});
                return;
            }

            const response = await UserModel.findByIdAndDelete(id);

            res.status(200).json({response, msg: "User deleted sucessfully"})

        } catch(err) {
            console.log(err);
        }

    },

    confirmEmail: async(req: Request, res: Response)  => {

        try {

            const confirmEmailToken = req.params.token;
            
            if (!confirmEmailToken) {
                res.status(422).json({response: {}, msg: 'Token is required'})
                return;
            }

            const user = await UserModel.findOne({confirmEmailToken: confirmEmailToken});

            if (!user) {
                res.status(422).json({response: {}, msg: 'User not found'});
                return;
            }

            await UserModel.findOneAndUpdate({confirmEmailToken:confirmEmailToken}, {confirmEmailToken: null});


            const folder = {
                name: 'Root',
                owner: user?._id,
            }

            const responseFolder = await FolderModel.create(folder);
            
            await UserModel.findOneAndUpdate({_id: user?._id}, {root_folder: responseFolder._id.toString()});

            const response = await UserModel.findOne({_id : user?._id});

            res.status(200).json({response, msg: "Email confirmed sucessfully"});

        } catch(err: any) {
            console.log(err);
        }
    },

    validateToken: async(req: Request, res: Response) => {

        try {

            const { token } = req.body;

            if (!token) {
                return res.status(422).json({response: {}, msg: 'Token is required'})
            }
            
            try {
                const secret = environment.SECRET;
                jwt.verify(token, secret);

                return res.status(200).json({isValid: true, msg: 'Token valid'});

            } catch(err) {

                return res.status(400).json({isValid: false, msg: 'Token invalid'});
            
            }
            

        } catch(err) {
            console.log(err);
        }


    }

}

export { UserController };