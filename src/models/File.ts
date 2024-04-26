import mongoose, { Schema } from "mongoose";
import { FileInterface } from '../interfaces/file.interface';
import { SharedWithSchema } from "./SharedWith";


const FileSchema = new Schema<FileInterface> ({
    name: {type: String, required: true},

    key: {type: String, required: true},

    thumbKey: {type: String, required: false, default: null},

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    sharedWith: {
        type: [SharedWithSchema],
        required: false,
        defautl: [],
    },

    metadata: {
        type: {
            mimetype: {type: String, required: true},
            parent: {type: Schema.Types.ObjectId, ref: 'Folder', required: true},
            starred: {type: Boolean, required: true, default: false},
            trashed: {type: Boolean, required: true, default: false},
            personalFile: {type: Boolean, required: true, default:true},
            size: {type: Number, required: true},
            createdAt: {type: Date, default: Date.now},
        }
    }
}, {
    timestamps: true,
})

const File = mongoose.model<FileInterface>('File', FileSchema);

export { File, FileSchema }