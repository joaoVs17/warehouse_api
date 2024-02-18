import mongoose from "mongoose";

export interface UserInterface {
    first_name: string;
    last_name: string;
    email: string;
    recovery_email: string;
    phone: string;
    password: string;
    confirmEmailToken: string;
}