import mongoose from "mongoose";
import { DB_URL } from "./config.js";

export const connectDB = () => {
    mongoose.connect(DB_URL)
    .then(() => console.log('Server is connected'))
    .catch((err) => {
        console.log('Database connection issue')
        console.log(err)
        process.exit(1);
    })
}