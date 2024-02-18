import { Request, Response } from "express";
import { User as UserModel, userSchema } from "../models/User";
import { Folder as FolderModel } from "../models/Folder";
import crypto from 'crypto';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const UserController = {

    create: async (req: Request, res: Response) => {
        
        const { first_name, last_name, email, recovery_email, phone, password, confirmPassword} = req.body;

        try {
            //Validate
            if (!first_name) {
                return res.status(422).json({msg: "First name is required"});
            }
            if (!last_name) {
                return res.status(422).json({msg: "Last name is required"});
            }
            if (!email) {
                return res.status(422).json({msg: "Email is required"});
            }
            if (!password) {
                return res.status(422).json({msg: "Password is required"})
            }
            if (!confirmPassword) {
                return res.status(422).json({msg: "Confirm password is required"})
            }

            if (password !== confirmPassword) {
                return res.status(422).json({msg: "Passwords don't match"})
            }

            const userExists = await UserModel.findOne({email: email});

            if (userExists) {
                res.status(422).json({msg: "This email already exists"});
            }
    
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            const user = {
                first_name,
                last_name,
                email,
                recovery_email,
                phone,
                password: passwordHash,
                confirmEmailToken: crypto.randomBytes(16).toString('hex'),
            }
            
            const response = await UserModel.create(user);

            res.status(201).json({response, msg: "User Created Successfully"});

        } catch (err) {
            console.log(err);
        }
    },

    login: async(req: Request, res: Response) => {

        const { email, password } = req.body;
        
        try {

            if (!email) {
                res.status(422).json({msg: "Email is required"})
            }

            const user = await UserModel.findOne({email: email});
            
            console.log(typeof user);

            if (!user) {
                res.status(404).json({msg: "User not found"});
            }

            if (!password) {
                res.status(422).json({msg: "Password is required"})
            }




            if (process.env.SECRET) {
                const secret = process.env.SECRET;
                const token = jwt.sign ({
                    id: user!._id
                }, secret!)
    
                res.status(200).json({token,msg: "User logged in sucessfully"});
            }


        } catch (err: any) {
            console.log(err);
        }

    },
 
    get: async(req: Request, res: Response) => {
    
        try {
            const id = req.params.id;

            const user = await UserModel.findById(id, '-password');

            if (!user) {
                res.status(404).json({msg: "User not found"});
            }

            res.status(200).json({user});

        } catch (err:any) {
            console.log(err);
        }

    },

    getAll: async (req: Request, res: Response) => {
        
        try {
            const response = await UserModel.find();
            res.json({response})
        } catch(err) {
            console.log(err);
        }

    },

    delete: async (req: any, res: any) => {
        
        try {
            
            const id = req.params.id;
            const user = await UserModel.findById(id);

            if(!user) {
                res.status(404).json({msg: "User not found"});
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
                res.status(422).json({msg: 'Token is required'})
            }

            const user = await UserModel.findOne({confirmEmailToken: confirmEmailToken});

            if (!user) {
                res.status(422).json({msg: 'User not found'})
            }

            const response = await UserModel.findOneAndUpdate({confirmEmailToken:confirmEmailToken}, {confirmEmailToken: null});

            const folder = {
                name: 'Root',
                owner: response?._id,
            }

            const responseFolder = await FolderModel.create(folder);
            
            res.status(200).json({response, msg: "Email confirmed sucessfully"});

        } catch(err: any) {
            console.log(err);
        }

    }

}

export { UserController };