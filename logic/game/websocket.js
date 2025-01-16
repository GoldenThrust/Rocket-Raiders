import { io } from "socket.io-client";
import { ctx } from "./utils/constant.js";
import CPlayer from "./player/connectedPlayers.js";
import { player } from "./player/currentPlayer.js";
import { weapons } from "./player/weapons/utils.js";
import { cp } from "./main.js";
import { damageAnimation, getGameId } from "./utils/function.js";

const socket = io("/", {
    withCredentials: true,
    query: {
        gameId: getGameId()
    },
})


socket.on('userDisconnected', (username) => {
    cp.delete(username)
})

socket.on('userConnected', (cplayer, id, user) => {
    cp.set(user.username, new CPlayer(cplayer.x, cplayer.y, cplayer.angle, cplayer.team, ctx, user));
    socket.emit('returnConnection', player, id)
})

socket.on('receivedConnection', (cplayer, user) => {
    cp.set(user.username, new CPlayer(cplayer.x, cplayer.y, cplayer.angle, cplayer.team, ctx, user));
})


socket.on('playerMotion', (username, x, y, angle, nitroPower) => {
    const player = cp.get(username);
    player?.update(x, y, angle, nitroPower)
})

socket.on('shootWeapon', (username, weaponId, weapon) => {
    const player = cp.get(username);
    player.weapons.push(new weapons[weaponId](username, weapon.x, weapon.y, weapon.angle, weapon.speed, player.ctx, 'brick'))
})

socket.on('weaponHit', (shooter, shootee, gunIndex) => {
    if (player.username === shootee) {
        navigator.vibrate([200, 500])
        damageAnimation(player)
    }

    const shooterPlayer = cp.get(shooter);
    if (shooterPlayer)
        shooterPlayer?.weapons?.splice(gunIndex, 1)

    const shooteePlayer = cp.get(shootee);
    if (shooteePlayer)
        damageAnimation(shooteePlayer)
})

socket.on('destroy', (shooter, shootee, powerUps) => {
    if (player.username === shootee) {
        if (powerUps) player.live = 0;
        player.dead = true;
        player.weaponHit = true;
    }

    const shooteePlayer = cp.get(shootee);
    if (shooteePlayer) {
        if (powerUps) shooteePlayer.live = 0;
        shooteePlayer.dead = true;
        shooteePlayer.weaponHit = true;
    }
})

socket.on('gameEnd', ()=> {
    window.location.href = `/game-end/${getGameId()}`;
})

export default socket;