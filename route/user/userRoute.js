import express from 'express';
import { getAllUser, registerUser } from '../../controller/user/userController.js';


const userRouter = express.Router();

userRouter.get('/', getAllUser);
userRouter.post('/', registerUser);

export default userRouter;
