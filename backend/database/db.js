import dotenv from 'dotenv';
dotenv.config(); // ✅ must be at the top

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SpotifyClone",
    });

    console.log("MongoDb Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;