import express from 'express';
import { deleteUser, getAllUser, getUserById, signIn, signUp, updateUser } from '../../controller/user/userController.js';
import {isAuthenticated} from '../../middleware/userMiddleware.js';


const userRouter = express.Router();

//userRouter.get('/', getAllUser);
//userRouter.get('/:id', getUserById);
userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.put('/:id',isAuthenticated ,updateUser);
userRouter.delete('/:id',isAuthenticated, deleteUser);

export default userRouter;
