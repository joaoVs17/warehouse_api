import mongoose from 'mongoose';

export interface FileInterface {

    name: string;
    key: string;
    url: string;
    folder: mongoose.Schema.Types.ObjectId;
    owner: mongoose.Schema.Types.ObjectId;
    metadata: {
        mimetype: string;
        parent: string;
        starred: boolean;
        personalFile: boolean;
        size: number;
        createdAt: Date;
    }

}