import { body,validationResult} from "express-validator";

export const blogValidator = [
  body("title").notEmpty().withMessage("title is important").bail(),
  body("description").notEmpty().withMessage("description is important").bail(),

    (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];
