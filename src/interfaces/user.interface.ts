import mongoose from "mongoose";

export interface UserInterface {
    first_name: String;
    last_name: String;
    email: String;
    recovery_email: String;
    phone: String;
    password: String;
    confirmEmailToken: String;
}