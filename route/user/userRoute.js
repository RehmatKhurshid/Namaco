import express from 'express';
import { deleteUser, getAllUser, getUserById, signIn, signUp, updatePassword, updateUser } from '../../controller/user/userController.js';
import {isAuthenticated} from '../../middleware/userMiddleware.js';
import { signInValidation } from '../../validators/signin.validation.js';
import { signUpValidator } from '../../validators/user.validator.js';
import validate from '../../middleware/validate.middleware.js';
import allowRoles from '../../middleware/role.middleware.js';
import  apiLimiter  from '../../middleware/rateLimit-middleware.js';

const userRouter = express.Router();

//userRouter.get('/', getAllUser);
//userRouter.get('/:id', getUserById);
userRouter.post('/signup',signUpValidator, validate, signUp);
userRouter.post('/signin',apiLimiter,signInValidation,validate, signIn);
userRouter.post('/change-password',isAuthenticated,updatePassword);
userRouter.put('/:id',isAuthenticated ,updateUser);
userRouter.delete('/:id',isAuthenticated, allowRoles('admin'),deleteUser);

export default userRouter;
