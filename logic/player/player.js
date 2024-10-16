import SpriteAnimation from "../utils/spriteAnimation.js";
import { drawSpriteFrame, getFrameDuration, getRandomInt, } from "../utils/utils.js";
import imgData from "./playerImg.js";

export const playerSpawnLocation = () => [getRandomInt(-100, 100), getRandomInt(-100, 100)];
// export const player = new User(userName, getRandomInt(-maxDistance + 100, maxDistance - 100), getRandomInt(-maxDistance + 100, maxDistance - 100), ctx);


export default class Player {
    constructor(username, x, y, ctx) {
        this.username = username;
        this.x = x; // change to internal
        this.y = y;
        this.w = 35;
        this.h = 50;
        this.live = 2;
        this.dead = false;
        this.weaponHit = false;
        this.damage = false;
        this.ctx = ctx;
        this.player = imgData[0];
        this.nitro = imgData[1];
        this.nitroPower = 0;
        this.angle = (Math.PI / 180) * getRandomInt(0, 360);
        this.speed = 0;
        this.maxSpeed = 5;
        this.gunSpeed = 5;
        this.friction = 0.1;
        this.weaponId = 'gun';
        this.weapons = []
        this.lastUpdate = 0;
        this.explosion = null;
    }

    draw(t) {
        this.ctx.save();

        this.ctx.translate(this.x, this.y);

        this.ctx.rotate(-this.angle);

        // this.ctx.fillStyle = 'white';
        // this.ctx.fillRect(0, 0, this.w, this.h);
        if (this.damage) {
            this.ctx.globalAlpha = 0.5;
        }


        if (!this.dead) {
            this.ctx.drawImage(this.player, -this.w / 2, -this.h / 2, this.w, this.h);
            this.ctx.globalAlpha = this.nitroPower;
            this.ctx.drawImage(this.nitro, -this.w / 4, this.h / 2, this.w / 2, this.h / 2);
        }

        if (this.explosion) {
            this.explosion.animate(t);
            console.log(this.explosion.state, this.explosion.numberOfInterations);
        }

        this.ctx.restore();

        this.weapons.forEach((weapon) => {
            weapon.draw()
        })
    }

    respawn() {
        this.explosion = null;
        const loc = playerSpawnLocation();
        this.angle = (Math.PI / 180) * getRandomInt(0, 360);
        this.x = loc[0];
        this.y = loc[1];

        setTimeout(() => {
            this.dead = false;
            this.weaponHit = false;
        }, 5000)
    }

    getVertices() {
        const rad = Math.hypot(this.w, this.h) / 2;
        const alpha = Math.atan2(this.w, this.h);

        const vertices = [
            {
                x: this.x - Math.sin(this.angle - alpha) * rad,
                y: this.y - Math.cos(this.angle - alpha) * rad
            }, // Top-left
            {
                x: this.x - Math.sin(this.angle + alpha) * rad,
                y: this.y - Math.cos(this.angle + alpha) * rad
            },  // Top-right
            {
                x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
                y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
            },   // Bottom-left
            {
                x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
                y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
            },  // Bottom-right
        ];

        return vertices;
    }

    #drawVertices() {
        const vertices = this.getVertices();

        this.ctx.save();
        this.ctx.fillStyle = 'blue';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(vertices[0].x, vertices[0].y);

        vertices.forEach((vertex, i) => {
            if (i) {
                this.ctx.lineTo(vertex.x, vertex.y);
            }
        });

        // Close the shape
        this.ctx.lineTo(vertices[0].x, vertices[0].y);
        this.ctx.fill();

        this.ctx.restore();
    }

    updateState() {
        if (!this.live) {
            this.explosion = new SpriteAnimation(imgData[2], -this.w * 1.5, -this.h * 3.2, 50, 100, 2, 2, 1, 6, 30, 1);
            this.live = 2;
        }

        if (this.explosion && this.explosion.state === 'paused') {
            this.respawn()
        }
    }
}