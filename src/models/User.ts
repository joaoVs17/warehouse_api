import mongoose, { Schema } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";
import { Folder } from "./Folder";
import { SharedWithMeSchema } from "./SharedUser";

const userSchema = new Schema <UserInterface> ({

    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    recovery_email: {type: String, required: true}, 
    password: {type: String, required: true},


    filesSharedWithMe: {
        type: [SharedWithMeSchema],
        default: []
    },

    foldersSharedWithMe: {
        type: [SharedWithMeSchema],
        default: []
    },

    root_folder: {type: Schema.Types.ObjectId, ref: 'Folder'},

    confirmEmailToken: {type: String},
}, {
    timestamps: true,
})

const User = mongoose.model<UserInterface>('User', userSchema);

export { User, userSchema};