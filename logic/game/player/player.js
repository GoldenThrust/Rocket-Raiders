import { maxDistance } from "../utils/constant.js";
import { convertTitleToCamelCase, getGameId, getRandomInt } from "../utils/function.js";
import SpriteAnimation from "../utils/spriteAnimation.js";
import axios from "axios";
import Speciality from "./weapons/Speciality.js";
import { createSpatialAudio } from "../utils/audio.js";


export default class Player {
    constructor(x, y, angle, ctx, username = null, rocket = null, burst = null, speed = null, range = null, durability = null, fireRate = null, speciality) {
        const gameData = JSON.parse(sessionStorage.getItem(`gameData-${getGameId()}`));
        this.nitro = new Image();
        this.player = new Image();
        if (!username || !rocket || !burst) {
            axios.get('/api/auth/verify').then((response) => {
                const { username, selectedRocket } = response.data.response;
                this.username = username;
                this.nitro.src = `/${selectedRocket.flame}`;

                this.player.src = `/${selectedRocket.rocket}`;

                this.maxSpeed = selectedRocket.speed;
                this.range = selectedRocket.range;
                this.durability = selectedRocket.durability;
                this.live = selectedRocket.durability;
                this.fireRate = selectedRocket.fireRate;
                this.speciality = new Speciality(convertTitleToCamelCase(selectedRocket.speciality));
            }).catch((error) => {
                console.log(error);
            });
        } else {
            this.username = username;
            this.player.src = `/${rocket}`
            this.nitro.src = `/${burst}`

            this.maxSpeed = speed;
            this.range = range;
            this.durability = durability;
            this.live = durability;
            this.fireRate = fireRate;
            this.speciality = new Speciality(convertTitleToCamelCase(speciality));
        }


        
        
        this.x = x;
        this.y = y;
        this.w = 35;
        this.h = 50;
        this.dead = false;
        this.weaponHit = false;
        this.damage = false;
        this.ctx = ctx;
        this.nitroPower = 0;
        this.angle = angle;
        this.speed = 0;
        this.gunSpeed = 5;
        this.friction = 0.1;
        this.weaponId = 'gun';
        this.weapons = []
        this.lastUpdate = 0;
        this.explosion = null;
        this.explosionSprite = new Image();
        this.explosionSprite.src = '/assets/imgs/explosion.png';
        this.team = gameData?.name;
        this.audiopanner = createSpatialAudio(this.x, this.y, this.angle);
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
        }


        this.ctx.restore();

        this.weapons.forEach((weapon) => {
            weapon.draw()
        })
    }

    respawn() {
        this.explosion = null;
        this.live = this.durability;
        this.angle = (Math.PI / 180) * getRandomInt(0, 360);
        this.x = getRandomInt(-maxDistance.w + 100, maxDistance.w - 100);
        this.y = getRandomInt(-maxDistance.h + 100, maxDistance.h - 100);

        setTimeout(() => {
            this.dead = false;
            this.weaponHit = false;
        }, 2000)
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

        this.ctx.lineTo(vertices[0].x, vertices[0].y);
        this.ctx.fill();

        this.ctx.restore();
    }

    updateState() {
        this.audiopanner.positionX.value = this.x || window.innerWidth / 2;
        this.audiopanner.positionY.value = this.y || window.innerHeight / 2;

        if (!this.live && !this.explosion) {
            this.explosion = new SpriteAnimation(this.explosionSprite, -this.w * 2, -this.h * 2, 80, 80, 2, 2, 2, 3, 12, 1);
            this.live = this.durability || 1;
        }

        if (this.explosion && this.explosion.state === 'paused') {
            this.respawn()
        }
    }
}