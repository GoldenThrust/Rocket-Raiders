import { SocketAddress } from "net";
import Match from "../models/match.js";
import { redis } from "./db.js";
import Map from "../models/map.js";
import { balanceTeams } from "../utils/func.js";

// TODO: make sure only initiator are allow to make some changes in backend.

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
                    console.log('Connected from /home');
                    resolve(socket);
                })

                socket.on('initiateGame', (match) => {
                    socket.broadcast.emit('newMatches', match);
                });

                socket.on("disconnect", () => {
                    console.log('Disconnected from /home');
                });
            });

            this.ios.lobby.on('connection', async (socket) => {
                const gameId = socket.handshake.query.gameId;
                socket.join(gameId);

                socket.on('joinLobby', async () => {
                    try {
                        const match = JSON.parse(await redis.hget('matches', gameId));
                        match.connectPlayer++;
                        await redis.hset('matches', gameId, JSON.stringify(match));
                        this.ios.home.emit('updateMatches', match)
                    } catch (error) {
                        console.error(error);
                    }
                })

                socket.on('startGame', async () => {
                    const match = JSON.parse(await redis.hget('matches', gameId));

                    const players = [];
                    let teams = { red: { name: 'red', players: [] }, blue: { name: 'blue', players: [] }, neutral: { name: 'neutral', players: [] } };

                    match.players.forEach((team, i) => {
                        team.forEach((player) => {
                            if (player && Object.entries(player).length > 0) {
                                players.push(player._id);
                                if (match.players.length === 2) {
                                    if (i === 0) {
                                        teams.blue.players.push(player._id);
                                    } else {
                                        teams.red.players.push(player._id);
                                    }
                                } else {
                                    teams.neutral.players.push(player._id);
                                }
                            }
                        });
                    });


                    if (teams.neutral.players.length > 1) {
                        const newMatch = new Match({ players, teams: Object.values(teams), gameMode: match.gameMode, map: match.map._id });
                        this.ios.lobby.to(gameId).emit('startGame', newMatch._id.toString());
                    } else {
                        teams = balanceTeams(teams);
                        if (teams.blue.players.length >= 1 || teams.red.players.length >= 1) {
                            const newMatch = new Match({ players, teams: Object.values(teams), gameMode: match.gameMode, map: match.map._id });
                            await newMatch.save();
                            await redis.hdel('matches', gameId);
                            this.ios.home.emit('matchDeleted', match.id);
                            this.ios.lobby.to(gameId).emit('startGame', newMatch._id.toString());
                        } else {
                            socket.emit('gameStartFailed', 'Unable to start game player not sufficient');
                        }
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
                                        console.log("initiator changed");
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

                        if (--match.connectPlayer <= 0) {
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

                    console.log('Disconnecting from /lobby');
                });

                socket.on("disconnect", () => {
                    console.log('Disconnected from /lobby');
                });
            });

            this.ios.io.on("connection", async (socket) => {
                const gameId = socket.handshake.query.gameId;
                socket.join(gameId);

                socket.on('connected', (player) => {
                    console.log('Connected from /game', player);
                    socket.to(gameId).emit('userConnected', player, socket.id, socket.user.toJSON());
                });

                socket.on('returnConnection', (player, id) => {
                    console.log('returnConnection', player);
                    socket.to(id).emit('receivedConnection', player, socket.user.toJSON());
                });

                socket.on("disconnect", () => {
                    console.log('Disconnected');
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

                socket.on('destroy', (shooter, shootee) => {
                    socket.to(gameId).emit('destroy', shooter, shootee);
                });

                resolve(true);
            });
        });

        return this.connectionPromise;
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
