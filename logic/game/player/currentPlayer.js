import { ctx, maxDistance, userName } from "../utils/constant.js";
import { cp } from "../main.js";
import { checkCollision, damageAnimation } from "../utils/function.js";
import socket from "../websocket.js";
import Player, { playerSpawnLocation } from "./player.js";
import { weapons } from "./weapons/utils.js";


export default class User extends Player {
    constructor(username, x, y, ctx) {
        super(username, x, y, ctx);
        this.#addEventListener();
    }

    #addEventListener() {
        addEventListener('devicemotion', (e) => {
            if (!this.dead) {
                let { x = 0, y = 0 } = e.accelerationIncludingGravity || {};

                x = Math.round(x) - 10;
                y = Math.round(y);

                this.speed -= x * 1.1;

                this.nitroPower = this.speed / this.maxSpeed;

                if (this.speed != 0) {
                    const flip = this.speed > 0 ? 5 : -5;
                    this.angle -= (0.003 * y) * flip;
                }
            }
        });

        addEventListener('click', () => {
            if (!this.dead) {
                const wObj = new weapons[this.weaponId](this.username, this.x, this.y, this.angle, this.speed + this.gunSpeed, this.ctx)
                socket.emit('onShoot', this.username, this.weaponId, wObj);
                this.weapons.push(wObj)
            }
        })
    }

    update() {
        this.updateState()

        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }


        this.speed = Math.min(this.speed, this.maxSpeed);
        this.speed = Math.max(this.speed, -this.maxSpeed);

        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);

        this.x = Math.min(this.x, maxDistance);
        this.x = Math.max(this.x, -maxDistance);
        this.y = Math.min(this.y, maxDistance);
        this.y = Math.max(this.y, -maxDistance);

        // if (this.weapons.length < 100) {
        // const wObj = new weapons[this.weaponId](this.username, this.x, this.y, this.angle, this.speed + this.gunSpeed, this.ctx)
        // socket.emit('onShoot', this.username, this.weaponId, wObj);
        // this.weapons.push(wObj)
        // }

        this.weapons.forEach((weapon, i) => {
            const update = weapon.update()


            cp.forEach((cplayer) => {
                if (checkCollision(cplayer, weapon)) {
                    if (cplayer.live && !cplayer.weaponHit) {
                        damageAnimation(cplayer);
                        socket.emit('weaponHit', this.username, cplayer.username, i)
                        this.weapons.splice(i, 1)
                    }
                    
                    if (cplayer.live === 0 && !cplayer.dead) {
                        cplayer.dead = true;
                        cplayer.weaponHit = true;
                        socket.emit('destroy', this.username, cplayer.username);
                    }
                }
            })

            if (update) {
                this.weapons.splice(i, 1)
            }
        })

        socket.emit('onmotion', this)
    }
}


export const player = new User(userName, ...playerSpawnLocation(), ctx);