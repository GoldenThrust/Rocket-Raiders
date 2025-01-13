import { ctx, maxDistance } from "../utils/constant.js";
import { cp } from "../main.js";
import { checkCollision, damageAnimation, getGameId, getRandomInt } from "../utils/function.js";
import socket from "../websocket.js";
import Player from "./player.js";
import { weapons } from "./weapons/utils.js";

export default class User extends Player {
    constructor(ctx) {
        const playerPosition = JSON.parse(sessionStorage.getItem(`playerPosition-${getGameId()}`));
        let x = getRandomInt(-maxDistance.w + 100, maxDistance.w - 100);
        let y = getRandomInt(-maxDistance.h + 100, maxDistance.h - 100);
        let angle = (Math.PI / 180) * getRandomInt(0, 360);

        if (!playerPosition || (playerPosition.time / 60000) > 15) {
            sessionStorage.setItem(`playerPosition-${getGameId()}`, JSON.stringify({ x, y, angle, time: 0 }));
        } else {
            x = playerPosition.x;
            y = playerPosition.y;
            angle = playerPosition.angle;
        }

        super(x, y, angle, ctx);
        this.key = {
            down: false,
            left: false,
            right: false
        }
        this.controllerType = 'Motion';
        this.motionSensor = this.motionSensor.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this.shoot = false;
        this.lastFire = 0;
        this.#addEventListener();
    }

    #addEventListener() {
        const shoot = () => {
            this.shoot = true;
        }
        const holdfire = () => {
            this.shoot = false;
        }

        addEventListener('devicemotion', this.motionSensor);

        addEventListener('mousedown', shoot)
        addEventListener('mouseup', holdfire)

        addEventListener("touchstart", shoot)
        addEventListener("touchend", holdfire)
        addEventListener("keydown", (event) => {
            if (event.key === 'Enter' | event.key === ' ') {
                shoot();
            }
        })
        addEventListener("keyup", (event) => {
            if (event.key === 'Enter' | event.key === ' ') {
                holdfire();
            }
        })
    }

    motionSensor(e) {
        if (!this.dead) {
            let { x = 0, y = 0 } = e.accelerationIncludingGravity || {};

            if (!x) {
                this.controllerType = 'Keyboard';
                removeEventListener('devicemotion', this.motionSensor);
                addEventListener('keydown', this.keyDown);
                addEventListener('keyup', this.keyUp);

            }


            x = Math.round(x) - 10;
            y = Math.round(y);

            this.speed -= x * 1.1;

            if (this.speed != 0) {
                const flip = this.speed > 0 ? 5 : -5;
                this.angle -= (0.003 * y) * flip;
            }
        }
    }

    keyUp(e) {
        if (!this.dead) {
            if (e.key == 'ArrowDown') {
                this.key.down = false;
            }
            if (e.key == 'ArrowRight') {
                this.key.right = false;
            }
            if (e.key == 'ArrowLeft') {
                this.key.left = false;
            }
        }
    }

    keyDown(e) {
        console.log(e.key)
        if (!this.dead) {
            if (e.key == 'ArrowDown') {
                this.key.down = true;
            }
            if (e.key == 'ArrowRight') {
                this.key.right = true;
            }
            if (e.key == 'ArrowLeft') {
                this.key.left = true;
            }
        }
    }

    update(t) {
        this.updateState()

        if (this.controllerType === 'Keyboard') {
            this.speed += 0.5;
            if (this.key.down) {
                this.speed -= 0.5;
            }
            if (this.key.left) {
                this.angle += 0.05;
            }
            if (this.key.right) {
                this.angle -= 0.05;
            }
        }

        if (this.shoot) {
            if (!this.dead && t - this.lastFire > this.fireRate) {
                const wObj = new weapons[this.weaponId](this.username, this.x, this.y, this.angle, this.speed + this.gunSpeed, this.ctx)
                socket.emit('onShoot', this.username, this.weaponId, wObj);
                this.weapons.push(wObj)
                this.lastFire = t;
                console.log
            }
        }

        this.nitroPower = this.speed / this.maxSpeed;

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

        this.x = Math.min(this.x, maxDistance.w);
        this.x = Math.max(this.x, -maxDistance.w);
        this.y = Math.min(this.y, maxDistance.h);
        this.y = Math.max(this.y, -maxDistance.h);

        sessionStorage.setItem(`playerPosition-${getGameId()}`, JSON.stringify({ x: this.x, y: this.y, angle: this.angle, date: t }))

        // if (this.weapons.length < 100) {
        // const wObj = new weapons[this.weaponId](this.username, this.x, this.y, this.angle, this.speed + this.gunSpeed, this.ctx)
        // socket.emit('onShoot', this.username, this.weaponId, wObj);
        // this.weapons.push(wObj)
        // }

        this.weapons.forEach((weapon, i) => {
            const update = weapon.update(this.range)


            cp.forEach((cplayer) => {
                if (cplayer.team != this.team && cplayer.team != 'neutral') {
                    if (checkCollision(cplayer, weapon)) {
                        if (cplayer.live && !cplayer.weaponHit) {
                            damageAnimation(cplayer);
                            socket.emit('weaponHit', this.username, cplayer.username, i)
                            this.weapons.splice(i, 1)
                        }

                        if (cplayer.live === 0 && !cplayer.dead) {
                            cplayer.dead = true;
                            cplayer.weaponHit = true;
                            socket.emit('destroy', this, cplayer);
                        }
                    }
                }
            })

            if (update) {
                this.weapons.splice(i, 1)
            }
        })

        socket.emit('onmotion', this.username, this.x, this.y, this.angle, this.nitroPower)
    }
}

export const player = new User(ctx);