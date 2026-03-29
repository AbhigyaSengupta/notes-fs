import mongoose from "mongoose"

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.URL)
        console.log("Database is connect to port ",process.env.PORT);
    } catch (error) {
        console.log(error);
    }
}