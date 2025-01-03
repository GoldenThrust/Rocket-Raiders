// import { redis } from "./db.js";

class WebSocket {
    constructor() {
        this.io = null;
        this.socket = null;
        this.room = null;
        this.connectionPromise = null;
    }

    async getConnection(io) {
        this.io = io;

        this.connectionPromise = new Promise((resolve, reject) => {
            io.on("connection", async (socket) => {
                this.socket = socket;

                // try {
                //     await redis.set(`${socket.id}`, `${socket.handshake.query.username}`, 64000)
                // } catch (err) {
                //     console.error(err);
                // }

                // game socket
                socket.on('connected', (player) => {
                    socket.broadcast.emit('userConnected', player, socket.id);
                })

                socket.on('returnConnection', (player, id) => {
                    // console.log(`${socket.handshake.query.username} returing connection to ${player.username} ${id}`);
                    socket.to(id).emit('receivedConnection', player);
                })

                socket.on("disconnect", () => {
                    // socket.broadcast.emit('userDisconnected', socket.handshake.query.username);
                });

                socket.on('onmotion', (player) => {
                    socket.broadcast.emit('playerMotion', player);
                })

                socket.on('onShoot', (username, weaponId, weapon) => {
                    socket.broadcast.emit('shootWeapon', username, weaponId, weapon) 
                })

                socket.on('weaponHit', (shooter, shootee, gunIndex) => {
                    socket.broadcast.emit('weaponHit', shooter, shootee, gunIndex);
                });

                // Home Socket
                socket.on('initiateGame', (match) => {
                    socket.broadcast.emit('newMatches', match);
                })

                socket.on('destroy', (shooter, shootee) => {
                    socket.broadcast.emit('destroy', shooter, shootee)
                })

                resolve(true);
            });
        });

        return this.connectionPromise;
    }

    async sendParticles() {

    }
}

const websocket = new WebSocket();
export default websocket;
