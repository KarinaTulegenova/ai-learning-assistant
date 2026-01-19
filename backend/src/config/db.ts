import mongoose from "mongoose"

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error("MONGO_URI is missing")
  }

  try {
    await mongoose.connect(uri)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection error:", (error as Error).message)
    process.exit(1)
  }
}

export default connectDB
