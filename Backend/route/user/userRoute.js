import express from "express";

import {
  deleteUser,
  getAllUser,
  getUserById,
  signIn,
  signUp,
  updatePassword,
  updateUser,
} from "../../controller/user/userController.js";

import { isAuthenticated } from "../../middleware/userMiddleware.js";

import { signInValidation } from "../../validators/signin.validation.js";

import { signUpValidator } from "../../validators/user.validator.js";

import validate from "../../middleware/validate.middleware.js";

import allowRoles from "../../middleware/role.middleware.js";

import apiLimiter from "../../middleware/rateLimit-middleware.js";

const userRouter = express.Router();

// PUBLIC
userRouter.post(
  "/signup",
  signUpValidator,
  validate,
  signUp
);

userRouter.post(
  "/signin",
  apiLimiter,
  signInValidation,
  validate,
  signIn
);

// PRIVATE
userRouter.post(
  "/change-password",
  isAuthenticated,
  updatePassword
);

userRouter.put(
  "/me",
  isAuthenticated,
  updateUser
);

// ADMIN
userRouter.get(
  "/",
  isAuthenticated,
  allowRoles("admin"),
  getAllUser
);

userRouter.get(
  "/:id",
  isAuthenticated,
  allowRoles("admin"),
  getUserById
);

userRouter.delete(
  "/:id",
  isAuthenticated,
  allowRoles("admin"),
  deleteUser
);

export default userRouter;