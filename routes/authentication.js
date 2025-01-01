import { Router } from "express";
import { loginValidator, resetPasswordValidator, signupValidator, validate } from "../middlewares/validators.js";
import authController from "../controllers/authenticationController.js";
const authRoutes = Router();

authRoutes.get('/verify', authController.verify)
authRoutes.post('/register', validate(signupValidator), authController.register)
authRoutes.post('/login', validate(loginValidator), authController.login)
authRoutes.get('/logout', authController.logout)
authRoutes.get('/activate/:crypto', authController.activateAccount)
authRoutes.post('/forgot-password', authController.forgotPassword)
authRoutes.post('/reset-password/:token', validate(resetPasswordValidator), authController.resetPassword)


export default authRoutes;