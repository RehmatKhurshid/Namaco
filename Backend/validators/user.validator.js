import { body, validationResult } from "express-validator";

export const signUpValidator = [
  body("firstName").notEmpty().withMessage("first name cant be empty").bail(),
  body("lastName").notEmpty().withMessage("last Name cant be empty").bail(),
  body("email").isEmail().withMessage("invalid email").bail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .bail(),
  body("mobile")
    .notEmpty()
    .isNumeric()
    .withMessage("mobile required")
    .isLength({ min: 10 })
    .withMessage("mobile must have 10 digits"),
  (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: error.array()[0],
      });
    }
   


    next();
  },
];
