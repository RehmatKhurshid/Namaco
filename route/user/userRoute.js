import express from 'express';
import { deleteUser, getAllUser, getUserById, registerUser, updateUser } from '../../controller/user/userController.js';


const userRouter = express.Router();

userRouter.get('/', getAllUser);
userRouter.get('/:id',getUserById); 
userRouter.post('/', registerUser);
userRouter.put('/:id',updateUser);
userRouter.delete('/:id',deleteUser);

export default userRouter;
