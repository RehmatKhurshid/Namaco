import express from "express"
import connectDB from "./utils/db/mongo.js";
import userRouter from "./route/user/userRoute.js"


const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRouter);

const PORT = 3000

app.listen(PORT, () => {
    console.log('server is running on port 3000')
})
