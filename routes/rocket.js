import { Router } from "express";
import rocketController from "../controllers/rocketController.js";
const rocketRoutes = Router();

rocketRoutes.get('/', rocketController.getAllRocket);
rocketRoutes.get('/set-rocket/:name', rocketController.setRocket);

export default rocketRoutes;