import mongoose, {Schema}  from "mongoose";

export interface UserInterface {
    
    first_name: string;
    last_name: string;
    email: string;
    recovery_email: string;
    /* phone: string; */
    password: string;

    filesSharedWithMe: [
        {
            owner: Schema.Types.ObjectId,
            archive: Schema.Types.ObjectId,
            permissions: string[],
        }
    ];
    foldersSharedWithMe: [
        {
            owner: Schema.Types.ObjectId,
            archive: Schema.Types.ObjectId,
            permissions: string[], 
        }
    ];

    confirmEmailToken: string;
    root_folder: Schema.Types.ObjectId;
}