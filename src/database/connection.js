import mongoose from "mongoose";
import { app } from "./../app.js";

import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    app.on("error", (error) => {
      console.log("Express App is not able to talk with DB!", error);
      throw error;
    });
    console.log(
      `\nMongoDB connected successfully!!\nDB HOST: ${connectionInstance.connection.host}`
    );
    // console.log(connectionInstance); // assignment explore it
  } catch (error) {
    console.log("MONGODB connection error !!! ", error);
    process.exit(1);
  }
};

export default connectDB;
