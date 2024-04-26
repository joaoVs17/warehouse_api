import mongoose, { Mongoose, Schema } from "mongoose";

const FolderSchema = new Schema ({

    name: {type: String, required: true},
    
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }],

    folders: [{
        type: Schema.Types.ObjectId,
        ref: 'Folder',
    }],

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    sharedWith: {
        type: [{
            userId: {type: Schema.Types.ObjectId, required: true},  
            permissions: {type: [String], default: []}
        }],
        required: false,
        defautl: [],
    },

    metadata : {
        type: {
            isPersonal: {type: Boolean, required: true, default: true},
            parent: {type: Schema.Types.ObjectId, ref: 'Folder', default: null},
            starred: {type: Boolean, required: true, default: false},
            trashed: {type: Boolean, required: true, default: false},
            createdAt: {type: Date, default: Date.now}
        }
    },
    
}, {
    timestamps: true,
})

const Folder = mongoose.model('Folder', FolderSchema);

export { Folder, FolderSchema }