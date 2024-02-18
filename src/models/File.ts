import fs from 'fs';
import path from "path";

import { promisify } from "util";
import mongoose, { Schema, CallbackWithoutResultAndOptionalError  } from "mongoose";
import { FileInterface } from '../interfaces/file.interface';
import { NextFunction } from 'express';
import { nextTick } from 'process';
import { UserInterface } from '../interfaces/user.interface';

const FileSchema = new Schema<FileInterface> ({
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
            starred: {type: Boolean, required: true, default: false},
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