import mongoose from "mongoose"

const connectDB = async MONGO_URI => {
    try {
        const { connection } = await mongoose.connect(MONGO_URI)

        console.log(`Connected to ${connection.host} successfully`)
    } catch (err) {
        console.log("Failed to connect to MongoDB database ", err)
        process.exit(1)
    }
}

export default connectDB