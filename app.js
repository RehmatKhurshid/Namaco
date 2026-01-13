import express from "express"
import connectDB from "./utils/db/mongo.js";
import userRouter from "./route/user/userRoute.js"
import blogRouter from "./route/blog/blogRoute.js";
import dotenv from 'dotenv';

const app = express();
connectDB();
dotenv.config();

//console.log('JWT_SECRET:', process.env.JWT_SECRET);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter)
app.use('/blog', blogRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log('server is running on port 3000')
})
