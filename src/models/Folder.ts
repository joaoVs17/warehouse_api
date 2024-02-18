import mongoose, { Schema } from "mongoose";
import { FileSchema } from "./File";

const FolderSchema = new Schema ({

    name: {type: String, required: true},
    
    files: {type: [FileSchema]},

    folders: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    metadata : {
        type: {
            isPersonal: {type: Boolean, required: true, default: true},
            parent: {type: String, default: null},
            starred: {type: Boolean, required: true, default: false},
            createdAt: {type: Date, default: Date.now}
        }
    },
    
}, {
    timestamps: true,
})

const Folder = mongoose.model('Folder', FolderSchema);

export { Folder, FolderSchema }