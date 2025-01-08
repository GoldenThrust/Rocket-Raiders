import { redis } from "../config/db.js";
import Map from "../models/map.js";
import Match from "../models/match.js";
import { v7 as uuid } from "uuid";
import Rocket from "../models/rocket.js";

class RocketController {
    async getAllRocket(req, res) {
        try {
            let rockets = await Rocket.find({});

            rockets = rockets.map((rocket) => {
                if (req.user.rockets.includes(rocket._id)) {
                    rocket.price = 0;
                }
                return rocket;
            });

            res.json({ status: "OK", rockets });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to get Rockets",
                error: error.message,
            });
        }
    }

    async setRocket(req, res) {
        try {
            const { name } = req.params;
            if (!name) {
                return res.status(400).json({ message: "Invalid rocket name" });
            }

            let rocket = await Rocket.findOne({ name });

            if (!rocket) {
                return res.status(404).json({ message: "Rocket not found" });
            }

            req.user.selectedRocket = rocket; 
            await req.user.save();

            res.json({ status: "OK", message: "Rocket selected successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to get Rockets",
                error: error.message,
            });
        }
    }
}

export default new RocketController();
