import mongoose from "mongoose";

async function main() {

    try {
        await mongoose.connect('mongodb://localhost:27017/warehouse');
        console.log('Connection Suceeded')
    } catch (err){
        console.log('Connection Error:', err);
    }

}

module.exports = main;