import mongoose from "mongoose";

export async function connectToMongoDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (err) {
    process.exit(1);
    console.log(err);
  }
}
