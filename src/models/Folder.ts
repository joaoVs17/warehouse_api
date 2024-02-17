import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema ({

    name: {type: String, required: true},
    
    files: {type: Array},

    folders: {type: Array},

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    metadata : {
        type: {
            isPersonal: {type: Boolean, required: true, default: true},
            parent: {type: String, required: true},
            starred: {type: Boolean, required: true, default: false},
            createdAt: {type: Date, default: Date.now}
        }
    },
    
}, {
    timestamps: true,
})

const Folder = mongoose.model('Folder', folderSchema);

export { Folder, folderSchema }