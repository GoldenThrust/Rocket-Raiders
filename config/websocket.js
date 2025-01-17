import { SocketAddress } from "net";
import Match from "../models/match.js";
import { redis } from "./db.js";
import { balanceTeams } from "../utils/func.js";
import { matchEndQueue } from "../worker.js";



const findAvailableSlot = (playerData, user) => {
    for (let i = 0; i < playerData.length; i++) {
        for (let j = 0; j < playerData[i].length; j++) {
            if (playerData[i][j]?.username === user.username) {
                throw new Error("No available slot");
            } else if (!playerData[i][j] || Object.keys(playerData[i][j]).length === 0) {
                playerData[i][j] = user.toJSON();
                return;
            }
        }
    }
};

// TODO: make sure only initiator are allow to make some changes in backend.
const duration = 10;
class WebSocket {
    constructor() {
        this.ios = null;
        this.connectionPromise = null;
    }

    async getConnection(ios) {
        this.ios = ios;

        this.connectionPromise = new Promise((resolve, reject) => {
            this.ios.home.on('connection', async (socket) => {
                socket.on("connected", () => {
                    resolve(socket);
                })

                socket.on('initiateGame', (match) => {
                    socket.broadcast.emit('newMatches', match);
                });
            });

            this.ios.lobby.on('connection', async (socket) => {
                const gameId = socket.handshake.query.gameId;
                socket.join(gameId);

                socket.on('endGame', async () => {
                    await redis.hdel('matches', gameId);
                    this.ios.lobby('endGame');
                });

                socket.on('joinLobby', async () => {
                    try {
                        const match = JSON.parse(await redis.hget('matches', gameId));
                        match.connectPlayer++;
                        findAvailableSlot(match.players, socket.user);
                        await redis.hset('matches', gameId, JSON.stringify(match));
                        this.ios.home.emit('updateMatches', match)
                        this.ios.lobby.to(gameId).emit('setGame', match)
                    } catch (error) {
                        console.error(error);
                    }
                })

                socket.on('startGame', async () => {
                    try {
                        const match = JSON.parse(await redis.hget('matches', gameId));

                        const players = [];
                        let stats = [];
                        let teams = { red: { name: 'red', players: [] }, blue: { name: 'blue', players: [] }, neutral: { name: 'neutral', players: [] } };

                        match.players.forEach((team, i) => {
                            team.forEach((player) => {
                                if (player && Object.entries(player).length > 0) {
                                    players.push(player._id);
                                    if (match.players.length === 2) {
                                        if (i === 0) {
                                            stats.push({ player: player._id, kills: 0, deaths: 0, team: 'blue' });
                                            teams.blue.players.push(player._id);
                                        } else {
                                            stats.push({ player: player._id, kills: 0, deaths: 0, team: 'red' });
                                            teams.red.players.push(player._id);
                                        }
                                    } else {
                                        stats.push({ player: player._id, kills: 0, deaths: 0, team: 'neutral' });
                                        teams.neutral.players.push(player._id);
                                    }
                                }
                            });
                        });



                        if (teams.neutral.players.length > 1) {
                            const endTime = new Date();
                            endTime.setMinutes(endTime.getMinutes() + duration);
                            const newMatch = new Match({ players, teams: Object.values(teams), gameMode: match.gameMode, map: match.map._id, stats, endTime });
                            await newMatch.save();

                            await matchEndQueue.add(
                                { matchId: newMatch._id.toString() },
                                { delay: duration * 60 * 1000 }
                            );

                            const populatedMatch = await newMatch.populate(['players'])

                            populatedMatch.players.forEach((player) => {
                                player.stats.matchesPlayed++;
                                player.save();
                            });
                            this.ios.lobby.to(gameId).emit('startGame', newMatch._id.toString());
                        } else {
                            teams = balanceTeams(teams);
                            if ((teams.blue.players.length >= 1 && teams.red.players.length >= 1) || teams.blue.players.length > 1 || teams.red.players.length > 1) {
                                stats = [];
                                teams.blue.players.forEach((player) => {
                                    stats.push({ player, kills: 0, deaths: 0, team: 'blue' });
                                });
                                teams.red.players.forEach((player) => {
                                    stats.push({ player, kills: 0, deaths: 0, team: 'red' });
                                });

                                const endTime = new Date();
                                endTime.setMinutes(endTime.getMinutes() + duration);

                                const newMatch = new Match({ players, teams: Object.values(teams), gameMode: match.gameMode, map: match.map._id, stats, endTime });
                                await newMatch.save();

                                await matchEndQueue.add(
                                    { matchId: newMatch._id.toString() },
                                    { delay: duration * 60 * 1000 }
                                );

                                const populatedMatch = await newMatch.populate(['players'])


                                populatedMatch.players.forEach((player) => {
                                    player.stats.matchesPlayed++;
                                    player.save();
                                });
                                await redis.hdel('matches', gameId);
                                this.ios.lobby.to(gameId).emit('startGame', newMatch._id.toString());
                            } else {
                                socket.emit('gameStartFailed', 'Unable to start game player not sufficient');
                            }
                        }

                        this.ios.home.emit('matchDeleted', match.id);
                    } catch (error) {
                        console.error('Error starting game:', error);
                        socket.emit('gameStartFailed', 'An error occurred while starting the game.');
                    }
                });

                socket.on('setGame', async (loc, oldLoc) => {
                    try {
                        const match = JSON.parse(await redis.hget('matches', gameId));
                        const i = loc.split(':');
                        const j = oldLoc.split(':');

                        if (oldLoc) {
                            match.players[j[0]][j[1]] = {};
                        }

                        match.players[i[0]][i[1]] = socket.user.toJSON();

                        await redis.hset('matches', gameId, JSON.stringify(match));

                        socket.to(gameId).emit('setGame', match);
                    } catch (err) {
                        console.error('Error in setGame:', err);
                    }
                });

                socket.on('setMap', async (map) => {
                    try {
                        const match = JSON.parse(await redis.hget('matches', gameId));
                        match.map = map;
                        await redis.hset('matches', gameId, JSON.stringify(match));
                        socket.to(gameId).emit("map", map);
                    } catch (error) {
                        console.error(error)
                    }
                })

                socket.on("disconnecting", async () => {
                    try {
                        const match = JSON.parse(await redis.hget('matches', gameId));
                        if (!match) return;

                        const playerData = match.players;
                        let nextPlayer = null;
                        let changeInitiator = false;

                        for (let i = 0; i < playerData.length; i++) {
                            for (let j = 0; j < playerData[i].length; j++) {
                                if (playerData[i][j].username === socket.user.username) {
                                    if (playerData[i][j].username === match.initiator.username) {
                                        if (nextPlayer) match.initiator = nextPlayer;
                                        else changeInitiator = true
                                    };
                                    playerData[i][j] = {};
                                }
                                if (playerData[i][j].username) {
                                    nextPlayer = playerData[i][j];
                                    if (changeInitiator) { match.initiator = nextPlayer; changeInitiator = false }
                                }
                            }
                        }

                        if (--match.connectPlayer <= 0 || !nextPlayer || !changeInitiator) {
                            await redis.hdel('matches', gameId);
                            socket.to(gameId).emit('matchDeleted');
                            this.ios.home.emit('matchDeleted', match.id)
                        } else {
                            await redis.hset('matches', gameId, JSON.stringify(match));
                            socket.to(gameId).emit('setGame', match);
                            this.ios.home.emit('updateMatches', match)
                        }
                        socket.leave(gameId);
                    } catch (err) {
                        console.error('Error in disconnecting:', err);
                    }
                });
            });

            this.ios.io.on("connection", async (socket) => {
                const gameId = socket.handshake.query.gameId;
                socket.join(gameId);

                socket.on('connected', (player) => {
                    socket.to(gameId).emit('userConnected', player, socket.id, socket.user.toJSON());
                });

                socket.on('returnConnection', (player, id) => {
                    socket.to(id).emit('receivedConnection', player, socket.user.toJSON());
                });

                socket.on('onmotion', (username, x, y, angle, nitroPower) => {
                    socket.to(gameId).emit('playerMotion', username, x, y, angle, nitroPower);
                });

                socket.on('onShoot', (username, weaponId, weapon) => {
                    socket.to(gameId).emit('shootWeapon', username, weaponId, weapon);
                });

                socket.on('weaponHit', (shooter, shootee, gunIndex) => {
                    socket.to(gameId).emit('weaponHit', shooter, shootee, gunIndex);
                });

                socket.on('destroy', async (shooter, shootee, powerUps = false) => {
                    try {
                        const match = await Match.findById(gameId).populate('stats.player');


                        for (let stat of match.stats) {
                            if (stat.player.username === shooter.username) {
                                stat.kills++;
                                stat.player.stats.totalKills++;
                                await stat.player.save();
                                if (match.gameMode !== 'free-for-all') {
                                    match.teams.forEach((team) => {
                                        if (team.name === shooter.team) {
                                            team.score++;
                                        }
                                    });
                                }
                            }
                            if (stat.player.username === shootee.username) {
                                stat.deaths++;
                                stat.player.stats.totalDeaths++;
                                await stat.player.save();
                            }
                        }

                        if (match.gameMode !== 'free-for-all') {
                            match.teams.forEach((team) => {
                                if (team.name === shooter.team) {
                                    team.score++;
                                }
                            });
                        }

                        await match.save();
                        socket.to(gameId).emit('destroy', shooter.username, shootee.username, powerUps);
                    } catch (error) {
                        console.error('Error handling destroy event:', error);
                    }
                });


                resolve(true);
            });
        });

        return this.connectionPromise;
    }

    async gameEnd(gameId) {
        const match = await Match.findById(gameId).populate(['teams.players', 'players', 'stats.player']);

        if (match.gameMode.toString() === 'free-for-all') {
            const highestKill = match.stats.reduce((prev, current) => (prev.kills > current.kills ? prev : current));
            highestKill.player.stats.matchesWon++;
            highestKill.player.save();
            match.winner = highestKill.player._id;
            match.save();
        } else {
            const highestScore = match.teams.filter((team) => team.name !== 'neutral').reduce((prev, current) => (prev.score > current.score ? prev : current));

            highestScore.players.forEach((player) => {
                player.stats.matchesWon++;
                player.save();
            })

            match.winningTeam = highestScore.name;
            match.save();
        }

        this.ios.io.to(gameId).emit('gameEnd');
    }

    async getMatches() {
        try {
            const redisMatches = await redis.hgetall('matches');
            const matches = {};
            Object.entries(redisMatches).forEach(([key, values]) => {
                matches[key] = {
                    ...JSON.parse(values)
                };
            });

            return matches;
        } catch (err) {
            console.error('Error in getMatches:', err);
            return {};
        }
    }
}

const websocket = new WebSocket();
export default websocket;
