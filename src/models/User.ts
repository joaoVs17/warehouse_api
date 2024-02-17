import mongoose, { Schema } from "mongoose";

const userSchema = new Schema ({

    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    recovery_email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
}, 
{timestamps: true},
)

const User = mongoose.model('User', userSchema);

export { User, userSchema};