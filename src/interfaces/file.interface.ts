import mongoose, { Schema } from 'mongoose';

interface sharedWith {
    user: Schema.Types.ObjectId,
    permissions: string[],
}

export interface FileInterface {

    name: string;
    key: string;
    thumbKey?: string;
    folder: Schema.Types.ObjectId;
    owner: Schema.Types.ObjectId;
    sharedWith: sharedWith[];
    metadata: {
        mimetype: string;
        parent: Schema.Types.ObjectId;
        starred: boolean;   
        trashed: boolean;
        personalFile: boolean;
        size: number;
        createdAt: Date;
    }

}