import mongoose from "mongoose";

const connectDB = async () => {

  try {
   // await mongoose.connect("mongodb+srv://rizwanbashir2311@gmail.com:rizwan.123@cluster0.dqqveyf.mongodb.net/"

    await mongoose.connect("mongodb://localhost:27017/namaco");
    //success log
    console.log("mongoose connected successfully....");
  } catch (error) {
    console.log(error, "errror in mongo");
  }
};
export default connectDB;
