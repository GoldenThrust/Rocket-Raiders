import { SocketAddress } from "net";
import Match from "../models/match.js";
import { redis } from "./db.js";

class WebSocket {
    constructor() {
        this.ios = null;
        this.socket = null;
        this.homeSocket = null;
        this.connectionPromise = null;
    }

    async getConnection(ios) {
        this.ios = ios;

        this.connectionPromise = new Promise((resolve, reject) => {
            this.ios.home.on('connection', async (socket) => {
                this.homeSocket = socket;
                socket.on('initiateGame', (match) => {
                    socket.broadcast.emit('newMatches', match);
                });

                socket.on('joinLobby', () => {
                    setTimeout(async () => {
                        socket.broadcast.emit('updateMatches', await this.getMatches());
                    }, 1000);
                })

                socket.on("disconnecting", async () => {
                    console.log('Disconnected from /home');
                    socket.broadcast.emit('updateMatches', await this.getMatches());
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
                    } catch (error) {
                        console.error(error);
                    }
                })

                socket.on('startGame', async () => {
                    const match = JSON.parse(await redis.hget('matches', gameId));

                    socket.emit('startGame', match);

                    // const gameMatch = new Match({ })
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
                            this.ios.lobby.emit('matchDeleted');
                        } else {
                            await redis.hset('matches', gameId, JSON.stringify(match));
                            socket.to(gameId).emit('setGame', match);
                        }

                        socket.leave(gameId);
                    } catch (err) {
                        console.error('Error in disconnecting:', err);
                    }

                    this.homeSocket.broadcast.emit('updateMatches', await this.getMatches());

                    console.log('Disconnecting from /lobby');
                });

                socket.on("disconnect", () => {
                    console.log('Disconnected from /lobby');
                });
            });

            this.ios.io.on("connection", async (socket) => {
                this.socket = socket;

                socket.on('connected', (player) => {
                    socket.broadcast.emit('userConnected', player, socket.id);
                });

                socket.on('returnConnection', (player, id) => {
                    socket.to(id).emit('receivedConnection', player);
                });

                socket.on("disconnect", () => {
                    console.log('Disconnected');
                });

                socket.on('onmotion', (player) => {
                    socket.broadcast.emit('playerMotion', player);
                });

                socket.on('onShoot', (username, weaponId, weapon) => {
                    socket.broadcast.emit('shootWeapon', username, weaponId, weapon);
                });

                socket.on('weaponHit', (shooter, shootee, gunIndex) => {
                    socket.broadcast.emit('weaponHit', shooter, shootee, gunIndex);
                });

                socket.on('destroy', (shooter, shootee) => {
                    socket.broadcast.emit('destroy', shooter, shootee);
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
