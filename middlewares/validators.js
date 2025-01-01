import { body, validationResult } from "express-validator";

// Middleware for handling validation results
export function validate(validations) {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json({ status: "ERROR", message: errors.array()[0]['msg'] });
  };
};


export const resetPasswordValidator = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
]


export const loginValidator = [
  body("username")
    .trim()
    .notEmpty(),
  ...resetPasswordValidator,
];

export const signupValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  ...loginValidator,
];
