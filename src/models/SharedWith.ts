import mongoose, { Schema } from "mongoose";

const SharedWithSchema =  new Schema ({
    user: {type: Schema.Types.ObjectId, required: true},
    permissions: {type: Array, required: false, default: []}
})

export {SharedWithSchema};