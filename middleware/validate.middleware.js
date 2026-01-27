import { validationResult } from "express-validator";

 const validate = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const error = new Error(error.msg);
    error.statusCode = 400;
    throw error;
  }



  next();
};

export default validate;
