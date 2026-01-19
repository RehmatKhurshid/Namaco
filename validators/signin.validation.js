import { body } from "express-validator";

export const signInValidation=[
    body("email").notEmpty().withMessage("email is required"),
    body("password").notEmpty().withMessage("passowrd is requird")
];