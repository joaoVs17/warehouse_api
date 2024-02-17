import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema ({
    name: {type: String, required: true},

    key: {type: String, required: true},

    url: {type: String, required: true}, 

    folder: {type: Schema.Types.ObjectId, ref:"Folder", required: true},

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    metadata: {
        type: {
            mimetype: {type: String, required: true},
            parent: {type: String, required: true},
            starred: {type: Boolean, required: true},
            personalFile: {type: Boolean, required: true},
            createdAt: {type: Date, default: Date.now},
        }
    }
},
{timestamps: true})

const File = mongoose.model('File', FileSchema);

export { File, FileSchema }