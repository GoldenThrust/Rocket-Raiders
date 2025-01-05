import { redis } from "../config/db.js";
import Map from "../models/map.js";
import Match from "../models/match.js";
import { v7 as uuid } from "uuid";


class gameController {
    async initiateGame(req, res) {
        try {
            const id = uuid()
            const gameMode = req.params.gameMode;

            const match = {
                id: id,
                gameMode,
                players: gameMode === "free-for-all" ? [Array(20).fill({})] : [Array(6).fill({}), Array(6).fill({})],
                initiator: req.user,
                map: {},
                connectPlayer: 0
            }
        
            await redis.hset('matches', id, JSON.stringify(match), 10 * 60)
            res.status(201).json({
                message: "Game initiated successfully",
                match,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Failed to initiate game",
                error: err.message,
            });
        }
    }
    async startGame(req, res) {
        try {
            const user = req.user;
            const gameMode = req.params.gameMode;
            const match = new Match({ gameMode, players: [user] });
            await match.save();

            res.status(201).json({
                message: "Game initiated successfully",
                gameId: match._id.toString(),
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Failed to initiate game",
                error: err.message,
            });
        }
    }

    async getMatch(req, res) {
        try {
            const match = JSON.parse(await redis.hget('matches', req.params.matchId));


            if (!match) {
                return res.status(404).json({
                    message: "Match not found",
                });
            }

            res.status(200).json({
                message: "Match retrieved successfully",
                match,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to retrieve match",
                error: error.message,
            });
        }
    }

    async getMatches(_, res) {
        try {
            const redisMatches = await redis.hgetall('matches');
            const matches = {};
            Object.entries(redisMatches).forEach(([key, values]) => {
                matches[key] = {
                    ...JSON.parse(values)
                }
            });


            res.status(200).json({
                message: "Active matches retrieved successfully",
                matches,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to retrieve active matches",
                error: error.message,
            });
        }
    }

    async getMaps(_, res) {
        try {
            const maps = await Map.find({});
            res.status(200).json({
                message: "Maps retrieved successfully",
                maps,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to retrieve active maps", error: error.message });
        }
    }
}

export default (new gameController);