import { body } from "express-validator";

export const signUpValidator= [
    
        body("firstName").notEmpty().withMessage("first name cant be empty"),
        body("lastName").notEmpty().withMessage("last Name cant be empty"),
        body("email").isEmail().withMessage("invalid email"),
        body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("mobile").notEmpty().isNumeric().withMessage("mobile required").isLength({min:10}).withMessage("mobile must have 10 digits")
];