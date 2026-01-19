import { body } from "express-validator";

export const blogValidator = [
  body("title").notEmpty().withMessage("title is important"),
  body("description").notEmpty().withMessage("description is important"),
];
