import { cp } from "../../main.js";
import { ctx } from "../../utils/constant.js";
import { killPlayer } from "../../utils/function.js";
import SpriteAnimation from "../../utils/spriteAnimation.js";
import socket from "../../websocket.js";
import { player } from "../currentPlayer.js";

class Speciality {
    constructor(type = 'sprayGun') {
        this.type = type;
        this.ctx = ctx;
        this.speciality = {
            sprayGun: this.#sprayGun.bind(this),
            timeFreeze: this.#timeFreeze.bind(this),
            blackHole: this.#blackHole.bind(this),
            trackGun: this.#trackGun.bind(this),
            sonicDash: this.#sonicDash.bind(this),
        };
        this.powerUp = false;
    }

    usePowersUp() {
        if (this.speciality[this.type]) {
            this.speciality[this.type]().initiate();
        }
    }

    updatePowersUp() {
        if (this.speciality[this.type] && this.powerUp) {
            this.speciality[this.type]().update();
        }
    }

    #sprayGun() {
        // const shots = 36;
        // const angleIncrement = (2 * Math.PI) / shots;

        // for (let i = 0; i < shots * 2; i++) {
        //     const angle = i * angleIncrement;
        //     const bulletX = player.x + Math.cos(angle) * 10;
        //     const bulletY = player.y + Math.sin(angle) * 10;

        // }

        return {
            initiate: () => { },
            update: () => { },
        }
    }

    #timeFreeze() {
        // const radius = 2000;
        // for (const [username, cplayer] of cp.entries()) {
        //     const distance = Math.hypot(player.x - cplayer.x, player.y - cplayer.y);
        //     if (distance <= radius) {
        //         cplayer.maxSpeed = cplayer.maxSpeed / 2;
        //         console.log(`${username} slowed down!`);
        //     }
        // }
        return {
            initiate: () => { },
            update: () => { },
        }
    }

    #blackHole() {
        // const radius = 2000;
        // for (const [username, cplayer] of cp.entries()) {
        //     const distance = Math.hypot(player.x - cplayer.x, player.y - cplayer.y);
        //     if (distance <= radius) {
        //         const dx = player.x - cplayer.x;
        //         const dy = player.y - cplayer.y;
        //         cplayer.x += dx * 0.1;
        //         cplayer.y += dy * 0.1;
        //         console.log(`${username} pulled towards black hole!`);
        //     }
        // }
        return {
            initiate: () => { },
            update: () => { },
        }
    }

    #trackGun() {
        // let bullets = 20;
        // const targetPlayers = Array.from(cp.values());

        // targetPlayers.forEach((target, index) => {
        //     if (bullets <= 0) return;

        //     const angle = Math.atan2(target.y - player.y, target.x - player.x);
        //     const bulletX = player.x + Math.cos(angle) * 10;
        //     const bulletY = player.y + Math.sin(angle) * 10;

        //     bullets--;
        // });
        return {
            initiate: () => { },
            update: () => { },
        }
    }

    #sonicDash() {
        return {
            initiate: () => {
                player.maxSpeed = Math.min(player.maxSpeed * 10, 30);
                this.powerUp = true;

                setTimeout(() => {
                    player.maxSpeed /= 10;
                    console.log(`Sonic Dash ended for ${player.username}`);
                    this.powerUp = false
                }, 10000);
            },
            update: () => {
                const radius = 1000;
                cp.forEach((cplayer) => {
                    const distance = Math.hypot(player.x - cplayer.x, player.y - cplayer.y);
                    if (distance <= radius) {
                        killPlayer(cplayer, player, socket, true);
                    }
                })
            }
        }
    }
}

export default Speciality;
