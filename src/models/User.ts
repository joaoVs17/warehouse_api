import mongoose, { Schema } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";

const userSchema = new Schema <UserInterface> ({

    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    recovery_email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},

    confirmEmailToken: {type: String}
}, {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

const User = mongoose.model<UserInterface>('User', userSchema);

export { User, userSchema};