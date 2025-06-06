import mongoose from "mongoose";
import { dbName } from "../constants.js";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
    console.log(
      `connection successfull to database: host->${connection.connection.host}`
    );
  } catch (error) {
    console.log(`failed to connect to databse: ${error}`);
    process.exit(1);
  }
};
