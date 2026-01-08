import express from "express"
import connectDB from "./utils/db/mongo.js";
import userRouter from "./route/user/userRoute.js"
import blogRouter from "./route/blog/blogRoute.js";


const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log('server is running on port 3000')
})
