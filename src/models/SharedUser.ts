import mongoose, { Schema } from "mongoose";

const SharedWithMeSchema =  new Schema ({
    archive: {type: Schema.Types.ObjectId, required: true},
    owner: {type: Schema.Types.ObjectId, required: true},
    permissions: {type: Array, required: false, default: []}
})

export {SharedWithMeSchema};