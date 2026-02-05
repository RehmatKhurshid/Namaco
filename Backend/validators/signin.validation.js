import { body, validationResult } from "express-validator";

export const signInValidation=[
    body("email").notEmpty().withMessage("email is required").bail(),
    body("password").notEmpty().withMessage("passowrd is requird").bail(),
      (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors,
      });
    }
     // res.json({ success: true, message: "Login successful",token:token });

    next();
  },
];