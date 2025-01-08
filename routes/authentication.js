import { Router } from "express";
import { loginValidator, resetPasswordValidator, signupValidator, validate } from "../middlewares/validators.js";
import authController from "../controllers/authenticationController.js";
import upload from "../utils/func.js";
import { verifyAdminToken } from "../middlewares/tokenManager.js";
const authRoutes = Router();

authRoutes.get('/verify', authController.verify)
authRoutes.put('/update-profile', upload('profile').single('avatar'), authController.updateProfile)
authRoutes.post('/register', validate(signupValidator), authController.register)
authRoutes.post('/login', validate(loginValidator), authController.login)
authRoutes.get('/logout', authController.logout)
authRoutes.get('/activate/:crypto', authController.activateAccount)
authRoutes.post('/forgot-password', authController.forgotPassword)
authRoutes.post('/reset-password/:crypto', validate(resetPasswordValidator), authController.resetPassword)
authRoutes.get('/admin/activate/:crypto', authController.adminActivateAccount)
authRoutes.post('/admin/login', authController.adminLoginLink)
authRoutes.get('/admin/verify', verifyAdminToken, authController.adminVerify)


authRoutes.post('/admin/create-map', verifyAdminToken, upload('map').single('map'), authController.createMap)
authRoutes.post('/admin/create-rocket', verifyAdminToken, upload('rocket').fields([
    { name: 'rocket', maxCount: 1 },
    { name: 'flame', maxCount: 1 }
]), authController.createRocket)


export default authRoutes;