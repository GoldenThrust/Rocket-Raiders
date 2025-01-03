import { io } from "socket.io-client";
import { ctx, userName } from "./utils/constant.js";
import CPlayer from "./player/connectedPlayers.js";
import { player } from "./player/currentPlayer.js";
import { weapons } from "./player/weapons/utils.js";
import { cp } from "./main.js";
import { damageAnimation } from "./utils/function.js";

const socket = io("/", {
    withCredentials: true,
    // query: {
    //     username: userName
    // },
})


socket.on('userDisconnected', (username) => {
    console.log('connection disconnected', cp)
    cp = cp.filter((cplayer) => cplayer.username !== username)
})

socket.on('userConnected', (cplayer, id) => {
    cp.push(new CPlayer(cplayer.username, cplayer.x, cplayer.y, ctx));
    console.log('connection established', cplayer.username)
    socket.emit('returnConnection', player, id)
})

socket.on('receivedConnection', (cplayer) => {
    cp.push(new CPlayer(cplayer.username, cplayer.x, cplayer.y, ctx));
})


socket.on('playerMotion', (cplayer) => {
    cp.map((p) => {
        if (p.username === cplayer.username) {
            p.update(cplayer.x, cplayer.y, cplayer.angle, cplayer.nitroPower)
        }
    })
})

socket.on('shootWeapon', (username, weaponId, weapon) => {
    cp.map((p) => {
        if (p.username === username) {
            p.weapons.push(new weapons[weaponId](username, weapon.x, weapon.y, weapon.angle, weapon.speed, p.ctx, 'brick'))
        }
    })
})

socket.on('weaponHit', (shooter, shootee, gunIndex) => {
    if (player.username === shootee) {
        navigator.vibrate([200, 500])
        damageAnimation(player)
    }

    cp.map((p) => {
        if (p.username === shooter) {
            p.weapons.splice(gunIndex, 1)
        }

        if (p.username === shootee) {
            damageAnimation(player)
        }
    })
})

socket.on('destroy', (shooter, shootee) => {
    if (player.username === shootee) {
        player.dead = true;
        player.weaponHit = true;
    }

    cp.map((p) => {
        if (p.username === shootee) {
            p.dead = true;
            p.weaponHit = true;
        }
    })
})

export default socket;