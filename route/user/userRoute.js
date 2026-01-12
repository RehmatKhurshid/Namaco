import express from 'express';
import { deleteUser, getAllUser, getUserById, signIn, signUp, updateUser } from '../../controller/user/userController.js';


const userRouter = express.Router();

//userRouter.get('/', getAllUser);
//userRouter.get('/:id', getUserById);
userRouter.post('/', signUp);
userRouter.get('/', signIn);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
