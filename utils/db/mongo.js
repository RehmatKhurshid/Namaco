import mongoose from "mongoose";

const connectDB = async () => {

  try {
    //await mongoose.connect('mongodb://127.0.0.1:27017/namaco');
    await mongoose.connect("mongodb://localhost:27017/namaco");
    //success log
    console.log("mongoose connected successfully....");
  } catch (error) {
    console.log(error, "errror in mongo");
  }
};
export default connectDB;
