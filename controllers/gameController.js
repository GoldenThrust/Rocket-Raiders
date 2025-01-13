import { redis } from "../config/db.js";
import Map from "../models/map.js";
import Match from "../models/match.js";
import { v7 as uuid } from "uuid";
import { matchEndQueue } from "../worker.js";


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
            const endTime = new Date(match.startTime);
            endTime.setMinutes(endTime.getMinutes() + 1);
            // endTime.setMinutes(endTime.getMinutes() + 10);
            match.endTime = endTime;
            await match.save();

            await matchEndQueue.add(
                { matchId: match._id.toString() },
                // { delay: 10 * 60 * 1000 }
                { delay: 2 * 1000 }
            );
            console.log('queuing')

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

    async getGame(req, res) {
        const { gameId } = req.params;
        try {
            const match = await Match.findById(gameId).populate(['map']);
            let teamName = null;

            outerLoop:
            for (let team of match.teams) {
                for (let teamPlayer of team.players) {
                    if (teamPlayer._id.toString() === req.user._id.toString()) {
                        teamName = team.name;
                        break outerLoop;
                    }
                }
            }


            res.status(200).json({ status: 'OK', match: { ...match.toJSON(), team: teamName } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to getGame", error: error.message });
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

    async getEndGame(req, res) {
        try {
            const gameId = req.params.gameId;

            if (!gameId) {
                return res.status(400).json({ message: 'Game ID is required' });
            }

            const match = await Match.findById(gameId).populate(['teams.players', 'players', 'stats.player']);

            if (!match) {
                return res.status(404).json({ message: 'Match not found' });
            }

            const auth = match.players.some(player => player._id.toString() === req.user._id.toString());
            if (!auth) {
                return res.status(403).json({ message: 'You are not authorized to view this match' });
            }

            const now = new Date();
            if (match.endTime > now) {
                return res.status(400).json({ message: 'The game is still ongoing' });
            }

            let winners = [];
            if (match.gameMode === 'free-for-all') {
                winners = match.stats.find(stat => stat.player._id.toString() === match.winner._id.toString());
            } else {
                winners = match.teams
                    .filter(team => team.name === match.winningTeam)
                    .flatMap(team => team.players.map(player =>
                        match.stats.find(stat => stat.player._id.toString() === player._id.toString())
                    ));
            }

            console.log(winners)

            return res.json({ status: 'OK', winners, gameMode: match.gameMode });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Failed to retrieve match details', error: e.message });
        }
    }
}

export default (new gameController);